import { GameRoom } from './GameRoom.js';
import { db } from '../db/supabase.js';
import { cleanWordList } from './words.js';

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No ambiguous characters like 0/O, 1/I
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function generateAdminKey() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let key = '';
  for (let i = 0; i < 8; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
}

export class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = new Map(); // roomCode -> GameRoom
    this.socketToRoom = new Map(); // socketId -> roomCode
  }

  createRoom(hostSocketId, customSettings = {}) {
    let code = generateRoomCode();
    while (this.rooms.has(code)) {
      code = generateRoomCode();
    }

    const adminKey = generateAdminKey();
    const room = new GameRoom(code, adminKey, hostSocketId, this.io);

    if (customSettings.rounds) room.settings.rounds = customSettings.rounds;
    if (customSettings.drawTime) room.settings.drawTime = customSettings.drawTime;
    if (customSettings.gameMode) room.settings.gameMode = customSettings.gameMode;
    if (customSettings.customWords) {
      const cleaned = cleanWordList(customSettings.customWords);
      if (cleaned.length > 0) {
        room.settings.customWords = cleaned;
      }
    }

    this.rooms.set(code, room);
    console.log(`[RoomManager] Created Room ${code} (AdminKey: ${adminKey})`);

    // Persist room to Supabase
    db.saveRoom(room);

    return { room, code, adminKey };
  }

  getRoom(code) {
    if (!code) return null;
    return this.rooms.get(code.toUpperCase().trim());
  }

  joinRoom(socket, code, data) {
    const cleanCode = code ? code.toUpperCase().trim() : '';
    const room = this.rooms.get(cleanCode);

    if (!room) {
      return { success: false, error: `Room "${cleanCode}" not found.` };
    }

    const result = room.addParticipant(socket, data);
    if (result.success) {
      this.socketToRoom.set(socket.id, cleanCode);
    }
    return result;
  }

  handleDisconnect(socketId) {
    const code = this.socketToRoom.get(socketId);
    if (!code) return;

    this.socketToRoom.delete(socketId);
    const room = this.rooms.get(code);
    if (room) {
      room.removeParticipant(socketId);

      // If room has no active connections for 15 minutes, cleanup
      if (room.players.size === 0) {
        setTimeout(() => {
          if (room.players.size === 0) {
            room.clearTimer();
            this.rooms.delete(code);
            console.log(`[RoomManager] Destroyed empty Room ${code}`);
          }
        }, 15 * 60 * 1000);
      }
    }
  }

  closeRoom(code, adminKey) {
    const cleanCode = code ? code.toUpperCase().trim() : '';
    const room = this.rooms.get(cleanCode);
    if (!room) return { success: false, error: 'Room not found' };

    const result = room.closeLobby(adminKey);
    if (result.success) {
      this.rooms.delete(cleanCode);
      console.log(`[RoomManager] Host permanently closed Room ${cleanCode}`);
    }
    return result;
  }
}
