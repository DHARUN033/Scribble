import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl.startsWith('http')) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    console.log(`[Supabase] ⚡ Connected to Supabase: ${supabaseUrl}`);
  } catch (err) {
    console.error(`[Supabase] ❌ Initialization failed:`, err.message);
  }
} else {
  console.log(`[Supabase] ℹ️ Running without Supabase cloud credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY in .env to enable cloud persistence.`);
}

const memoryGameSessions = [];

export const db = {
  isConfigured() {
    return !!supabase;
  },

  getClient() {
    return supabase;
  },

  // Save / Upsert Room
  async saveRoom(room) {
    if (!supabase) return null;
    try {
      const wordsArray = Array.isArray(room.settings?.customWords)
        ? room.settings.customWords
        : (typeof room.settings?.customWords === 'string'
            ? room.settings.customWords.split(/[\n,;]+/).map(w => w.trim()).filter(Boolean)
            : []);

      const { data, error } = await supabase
        .from('rooms')
        .upsert({
          code: room.code,
          admin_key: room.adminKey,
          status: room.state ? room.state.toLowerCase() : 'lobby',
          rounds: room.settings?.rounds || 3,
          draw_time: room.settings?.drawTime || 80,
          game_mode: room.settings?.gameMode || 'ffa',
          custom_words: wordsArray,
          updated_at: new Date().toISOString()
        }, { onConflict: 'code' })
        .select()
        .single();

      if (error) console.error('[Supabase] Error saving room:', error.message);
      return data;
    } catch (e) {
      console.error('[Supabase] saveRoom exception:', e.message);
      return null;
    }
  },

  // Update room status
  async updateRoomStatus(code, status) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({
          status: status.toLowerCase(),
          updated_at: new Date().toISOString()
        })
        .eq('code', code);

      if (error) console.error('[Supabase] Error updating room status:', error.message);
      return data;
    } catch (e) {
      console.error('[Supabase] updateRoomStatus exception:', e.message);
      return null;
    }
  },

  // Save Game Session & Podium Archive (Stores in Supabase and memory cache)
  async saveGameSession(sessionData) {
    const memoryRecord = {
      id: `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      room_code: sessionData.roomCode,
      winner_name: sessionData.winner?.name || 'Unknown',
      winner_score: sessionData.winner?.score || 0,
      winner_avatar: sessionData.winner?.avatar || null,
      total_rounds: sessionData.totalRounds || 3,
      game_mode: sessionData.gameMode || 'ffa',
      podium: sessionData.podium || [],
      all_players: sessionData.allPlayers || [],
      created_at: new Date().toISOString()
    };
    memoryGameSessions.unshift(memoryRecord);
    if (memoryGameSessions.length > 100) memoryGameSessions.pop();

    if (!supabase) return memoryRecord;
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert({
          room_code: sessionData.roomCode,
          winner_name: sessionData.winner?.name || 'Unknown',
          winner_score: sessionData.winner?.score || 0,
          total_rounds: sessionData.totalRounds || 3,
          game_mode: sessionData.gameMode || 'ffa',
          podium: sessionData.podium || [],
          all_players: sessionData.allPlayers || []
        })
        .select()
        .single();

      if (error) {
        console.error('[Supabase] Error saving game session:', error.message);
        return memoryRecord;
      }
      if (data && data.id) {
        memoryRecord.id = data.id;
      }
      return data || memoryRecord;
    } catch (e) {
      console.error('[Supabase] saveGameSession exception:', e.message);
      return memoryRecord;
    }
  },

  // Fetch All Lobby Results / Match History
  async getGameSessions(limit = 50) {
    if (!supabase) return memoryGameSessions.slice(0, limit);
    try {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Supabase] Error fetching game sessions:', error.message);
        return memoryGameSessions.slice(0, limit);
      }

      if (!data || data.length === 0) {
        return memoryGameSessions.slice(0, limit);
      }

      // Merge memory records that might not yet be in Supabase
      const existingCodesAndTimes = new Set(data.map(d => `${d.room_code}_${d.created_at}`));
      const unpersisted = memoryGameSessions.filter(m => !existingCodesAndTimes.has(`${m.room_code}_${m.created_at}`));
      return [...unpersisted, ...data].slice(0, limit);
    } catch (e) {
      console.error('[Supabase] getGameSessions exception:', e.message);
      return memoryGameSessions.slice(0, limit);
    }
  },

  // Update Global Leaderboard / Hall of Fame
  async updateLeaderboard(players, winnerName) {
    if (!supabase || !Array.isArray(players)) return null;
    try {
      for (const p of players) {
        if (!p.name || p.role !== 'player') continue;

        // Fetch existing stats
        const { data: existing } = await supabase
          .from('global_leaderboard')
          .select('*')
          .eq('player_name', p.name)
          .maybeSingle();

        const isWinner = p.name === winnerName;
        const currentScore = p.score || 0;

        if (existing) {
          await supabase
            .from('global_leaderboard')
            .update({
              total_score: (existing.total_score || 0) + currentScore,
              matches_played: (existing.matches_played || 0) + 1,
              matches_won: (existing.matches_won || 0) + (isWinner ? 1 : 0),
              highest_score: Math.max(existing.highest_score || 0, currentScore),
              avatar: p.avatar || existing.avatar,
              last_played_at: new Date().toISOString()
            })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('global_leaderboard')
            .insert({
              player_name: p.name,
              avatar: p.avatar || {},
              total_score: currentScore,
              matches_played: 1,
              matches_won: isWinner ? 1 : 0,
              highest_score: currentScore
            });
        }
      }
    } catch (e) {
      console.error('[Supabase] updateLeaderboard exception:', e.message);
    }
  },

  // Get Top Players Hall of Fame
  async getGlobalLeaderboard(limit = 10) {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('global_leaderboard')
        .select('*')
        .order('total_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Supabase] Error fetching leaderboard:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('[Supabase] getGlobalLeaderboard exception:', e.message);
      return [];
    }
  },

  // Get Custom Word Packs
  async getCustomWordPacks() {
    if (!supabase) return [];
    try {
      const { data, error } = await supabase
        .from('custom_word_packs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase] Error fetching word packs:', error.message);
        return [];
      }
      return data || [];
    } catch (e) {
      console.error('[Supabase] getCustomWordPacks exception:', e.message);
      return [];
    }
  },

  // Save new Custom Word Pack
  async saveCustomWordPack({ name, description, words, createdBy }) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('custom_word_packs')
        .insert({
          name: name.trim(),
          description: description || '',
          words: Array.isArray(words) ? words : words.split(/[\n,;]+/).map(w => w.trim()).filter(Boolean),
          created_by: createdBy || 'Host'
        })
        .select()
        .single();

      if (error) {
        console.error('[Supabase] Error saving word pack:', error.message);
        return null;
      }
      return data;
    } catch (e) {
      console.error('[Supabase] saveCustomWordPack exception:', e.message);
      return null;
    }
  }
};
