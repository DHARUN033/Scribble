// Built-in word preset templates that the Host can quickly load or customize
export const WORD_PRESETS = {
  general: [
    "Apple", "Airplane", "Alien", "Anchor", "Ant", "Backpack", "Banana", "Baseball", "Battery", "Beach",
    "Bicycle", "Bird", "Boat", "Book", "Bottle", "Bridge", "Burger", "Butterfly", "Cactus", "Camera",
    "Candle", "Car", "Castle", "Cat", "Cheese", "Clock", "Cloud", "Coffee", "Compass", "Cookie",
    "Crown", "Cup", "Diamond", "Dinosaur", "Dog", "Dolphin", "Door", "Dragon", "Drum", "Duck",
    "Eagle", "Egg", "Elephant", "Eye", "Feather", "Fire", "Fish", "Flag", "Flower", "Forest",
    "Fork", "Frog", "Ghost", "Giraffe", "Glasses", "Guitar", "Hammer", "Hat", "Heart", "Helicopter",
    "Horse", "House", "Ice cream", "Island", "Jellyfish", "Key", "Kite", "Knife", "Ladder", "Lamp",
    "Leaf", "Lemon", "Lightbulb", "Lion", "Lock", "Magnet", "Map", "Microphone", "Moon", "Mountain",
    "Mouse", "Mushroom", "Music", "Nest", "Ninja", "Octopus", "Orange", "Owl", "Paintbrush", "Pancake",
    "Parrot", "Penguin", "Piano", "Pizza", "Planet", "Pumpkin", "Pyramid", "Rabbit", "Rainbow", "Robot",
    "Rocket", "Rollercoaster", "Sandwich", "Scissors", "Shark", "Ship", "Shoe", "Skeleton", "Snake", "Snowman",
    "Sock", "Spider", "Spoon", "Star", "Submarine", "Sun", "Sword", "Telephone", "Telescope", "Tent",
    "Tiger", "Toothbrush", "Torch", "Tornado", "Train", "Tree", "Truck", "Umbrella", "Unicorn", "Volcano",
    "Watch", "Watermelon", "Whale", "Windmill", "Window", "Wizard", "Wolf", "Wrench", "Yo-yo", "Zebra"
  ],
  tech: [
    "Algorithm", "Antivirus", "Application", "Artificial Intelligence", "Bandwidth", "Binary", "Bluetooth", "Browser", "Bug", "Byte",
    "Cache", "Cloud", "Compiler", "Computer", "Cookie", "CPU", "Cybersecurity", "Database", "Debugging", "Developer",
    "Disk", "DNS", "Drone", "Email", "Ethernet", "Fiber optic", "Firewall", "Folder", "Framework", "Front-end",
    "Git", "GPU", "Hacker", "Hard drive", "Hardware", "Headphones", "HTML", "Hyperlink", "Internet", "IP address",
    "Java", "JavaScript", "Keyboard", "Laptop", "Linux", "Malware", "Memory", "Microchip", "Microphone", "Monitor",
    "Motherboard", "Mouse", "Network", "Node", "Operating System", "Password", "Phishing", "Pixel", "Podcast", "Processor",
    "Programmer", "Python", "Quantum computer", "RAM", "Robot", "Router", "Satellite", "Scanner", "Screen", "Server",
    "Smartphone", "Software", "Source code", "Spam", "Speaker", "SSD", "Streaming", "Supercomputer", "Tablet", "Terminal",
    "Touchscreen", "Trojan", "USB", "Virtual Reality", "Virus", "VPN", "Webcam", "Website", "Wi-Fi", "Windows"
  ],
  office_fun: [
    "Brainstorm", "Coffee break", "Deadline", "Email thread", "Escalation", "Feedback", "Freelancer", "KPI", "Lunch break", "Meeting",
    "Mentor", "Milestone", "Monday blues", "Networking", "Office chair", "Overtime", "Paycheck", "Presentation", "Promotion", "Quarterly goal",
    "Remote work", "Sticky note", "Spreadsheet", "Team building", "Water cooler", "Whiteboard", "Work from home", "Zoom call"
  ]
};

// Combined master dictionary for automatic Random Words mode
export const MASTER_RANDOM_WORDS = [
  ...WORD_PRESETS.general,
  ...WORD_PRESETS.tech
];

export function cleanWordList(wordsInput) {
  if (Array.isArray(wordsInput)) {
    return wordsInput
      .map(w => String(w).trim())
      .filter(w => w.length > 1);
  }
  if (typeof wordsInput === 'string') {
    return wordsInput
      .split(/[\n,;]+/)
      .map(w => w.trim())
      .filter(w => w.length > 1);
  }
  return [];
}
