import React, { useState, useEffect, useRef } from "react";
import { Smile, Clock, Cat, Coffee, Car, Trophy, Shirt, Music, Flag, Search } from "lucide-react";

// Categorized Emojis
const CATEGORIES = [
  {
    id: "smileys",
    label: "Smileys & People",
    icon: Smile,
    emojis: [
      { emoji: "😀", name: "Grinning Face" },
      { emoji: "😃", name: "Grinning Big Eyes" },
      { emoji: "😄", name: "Grinning Smiling Eyes" },
      { emoji: "😁", name: "Beaming Smiling Eyes" },
      { emoji: "😆", name: "Grinning Squinting" },
      { emoji: "😅", name: "Grinning with Sweat" },
      { emoji: "😂", name: "Tears of Joy" },
      { emoji: "🤣", name: "Floor Laughing" },
      { emoji: "😊", name: "Smiling Face" },
      { emoji: "😇", name: "Smiling with Halo" },
      { emoji: "🙂", name: "Slightly Smiling" },
      { emoji: "🙃", name: "Upside-Down Face" },
      { emoji: "😉", name: "Winking Face" },
      { emoji: "😌", name: "Relieved Face" },
      { emoji: "😍", name: "Smiling Heart-Eyes" },
      { emoji: "🥰", name: "Smiling with Hearts" },
      { emoji: "😘", name: "Blowing a Kiss" },
      { emoji: "😜", name: "Winking with Tongue" },
      { emoji: "🤪", name: "Zany Face" },
      { emoji: "🤓", name: "Nerd Face" },
      { emoji: "😎", name: "Sunglasses Face" },
      { emoji: "🤩", name: "Star-Struck" },
      { emoji: "🥳", name: "Partying Face" },
      { emoji: "😏", name: "Smirking Face" },
      { emoji: "🤔", name: "Thinking Face" },
      { emoji: "🤨", name: "Raised Eyebrow" },
      { emoji: "😴", name: "Sleeping Face" },
      { emoji: "🤢", name: "Nauseated Face" },
      { emoji: "🤮", name: "Face Vomiting" },
      { emoji: "🥵", name: "Hot Face" },
      { emoji: "🥶", name: "Cold Face" },
      { emoji: "🤯", name: "Exploding Head" },
      { emoji: "😈", name: "Smiling with Horns" },
      { emoji: "🤡", name: "Clown Face" },
      { emoji: "💩", name: "Pile of Poo" },
      { emoji: "👻", name: "Ghost" },
      { emoji: "💀", name: "Skull" },
      { emoji: "👽", name: "Alien" },
      { emoji: "👾", name: "Alien Monster" },
      { emoji: "🤖", name: "Robot" },
    ]
  },
  {
    id: "animals",
    label: "Animals & Nature",
    icon: Cat,
    emojis: [
      { emoji: "🐱", name: "Cat Face" },
      { emoji: "🐶", name: "Dog Face" },
      { emoji: "🐭", name: "Mouse Face" },
      { emoji: "Hamster", name: "Hamster Face" },
      { emoji: "🐰", name: "Rabbit Face" },
      { emoji: "🦊", name: "Fox Face" },
      { emoji: "🐻", name: "Bear Face" },
      { emoji: "🐼", name: "Panda Face" },
      { emoji: "Koala", name: "Koala Face" },
      { emoji: "🐯", name: "Tiger Face" },
      { emoji: "🦁", name: "Lion Face" },
      { emoji: "🐮", name: "Cow Face" },
      { emoji: "🐵", name: "Monkey Face" },
      { emoji: "🐔", name: "Chicken" },
      { emoji: "🐧", name: "Penguin" },
      { emoji: "🐦", name: "Bird" },
      { emoji: "🦄", name: "Unicorn" },
      { emoji: "🐝", name: "Honeybee" },
      { emoji: "🦋", name: "Butterfly" },
      { emoji: "🐙", name: "Octopus" },
      { emoji: "🐠", name: "Tropical Fish" },
      { emoji: "🐬", name: "Dolphin" },
      { emoji: "🌳", name: "Deciduous Tree" },
      { emoji: "🌲", name: "Evergreen Tree" },
      { emoji: "🌴", name: "Palm Tree" },
      { emoji: "🌵", name: "Cactus" },
      { emoji: "🍀", name: "Four Leaf Clover" },
      { emoji: "🌸", name: "Cherry Blossom" },
      { emoji: "🌹", name: "Rose" },
      { emoji: "🌻", name: "Sunflower" },
    ]
  },
  {
    id: "food",
    label: "Food & Drink",
    icon: Coffee,
    emojis: [
      { emoji: "🍎", name: "Red Apple" },
      { emoji: "🍊", name: "Tangerine" },
      { emoji: "🍋", name: "Lemon" },
      { emoji: "🍌", name: "Banana" },
      { emoji: "🍉", name: "Watermelon" },
      { emoji: "🍇", name: "Grapes" },
      { emoji: "🍓", name: "Strawberry" },
      { emoji: "🍒", name: "Cherries" },
      { emoji: "🍍", name: "Pineapple" },
      { emoji: "🥑", name: "Avocado" },
      { emoji: "🌶️", name: "Hot Pepper" },
      { emoji: "🥐", name: "Croissant" },
      { emoji: "🍞", name: "Bread" },
      { emoji: "🥨", name: "Pretzel" },
      { emoji: "🧀", name: "Cheese Wedge" },
      { emoji: "🍖", name: "Meat on Bone" },
      { emoji: "🥩", name: "Cut of Meat" },
      { emoji: "🍔", name: "Hamburger" },
      { emoji: "🍟", name: "French Fries" },
      { emoji: "🍕", name: "Pizza" },
      { emoji: "🌭", name: "Hot Dog" },
      { emoji: "🌮", name: "Taco" },
      { emoji: "🍳", name: "Cooking" },
      { emoji: "🍿", name: "Popcorn" },
      { emoji: "🍩", name: "Donut" },
      { emoji: "🍪", name: "Cookie" },
      { emoji: "🎂", name: "Birthday Cake" },
      { emoji: "🍫", name: "Chocolate Bar" },
      { emoji: "☕", name: "Hot Beverage" },
      { emoji: "🍵", name: "Teacup" },
      { emoji: "🍺", name: "Beer Mug" },
    ]
  },
  {
    id: "travel",
    label: "Travel & Places",
    icon: Car,
    emojis: [
      { emoji: "🚗", name: "Automobile" },
      { emoji: "🚕", name: "Taxi" },
      { emoji: "🚙", name: "SUV" },
      { emoji: "🚌", name: "Bus" },
      { emoji: "🏎️", name: "Racing Car" },
      { emoji: "🚓", name: "Police Car" },
      { emoji: "🚒", name: "Fire Engine" },
      { emoji: "🚚", name: "Delivery Truck" },
      { emoji: "🚲", name: "Bicycle" },
      { emoji: "🛴", name: "Kick Scooter" },
      { emoji: "🚨", name: "Police Light" },
      { emoji: "✈️", name: "Airplane" },
      { emoji: "🚁", name: "Helicopter" },
      { emoji: "⛵", name: "Sailboat" },
      { emoji: "🗺️", name: "World Map" },
      { emoji: "🏔️", name: "Snow Mountain" },
      { emoji: "🏕️", name: "Camping" },
      { emoji: "🏖️", name: "Beach with Umbrella" },
      { emoji: "🏠", name: "House" },
      { emoji: "🏢", name: "Office Building" },
      { emoji: "🏫", name: "School" },
      { emoji: "🏰", name: "Castle" },
      { emoji: "🗼", name: "Tokyo Tower" },
      { emoji: "🗽", name: "Statue of Liberty" },
      { emoji: "🌉", name: "Bridge at Night" },
    ]
  },
  {
    id: "activities",
    label: "Activities",
    icon: Trophy,
    emojis: [
      { emoji: "⚽", name: "Soccer Ball" },
      { emoji: "🏀", name: "Basketball" },
      { emoji: "🏈", name: "Football" },
      { emoji: "⚾", name: "Baseball" },
      { emoji: "🥎", name: "Softball" },
      { emoji: "🎾", name: "Tennis" },
      { emoji: "🏐", name: "Volleyball" },
      { emoji: "🎱", name: "Pool 8 Ball" },
      { emoji: "🏓", name: "Ping Pong" },
      { emoji: "🏸", name: "Badminton" },
      { emoji: "⛳", name: "Flag in Hole" },
      { emoji: "🏹", name: "Bow and Arrow" },
      { emoji: "🎣", name: "Fishing Pole" },
      { emoji: "🥊", name: "Boxing Glove" },
      { emoji: "🥋", name: "Martial Arts Uniform" },
      { emoji: "🏆", name: "Trophy" },
      { emoji: "🏅", name: "Sports Medal" },
      { emoji: "🎭", name: "Performing Arts" },
      { emoji: "🎨", name: "Artist Palette" },
      { emoji: "🎤", name: "Microphone" },
      { emoji: "🎧", name: "Headphones" },
      { emoji: "🎸", name: "Guitar" },
      { emoji: "🎮", name: "Video Game" },
    ]
  },
  {
    id: "objects",
    label: "Objects",
    icon: Shirt,
    emojis: [
      { emoji: "👕", name: "T-Shirt" },
      { emoji: "👔", name: "Necktie" },
      { emoji: "🧥", name: "Coat" },
      { emoji: "👖", name: "Jeans" },
      { emoji: "👗", name: "Dress" },
      { emoji: "🎒", name: "Backpack" },
      { emoji: "👞", name: "Shoe" },
      { emoji: "👑", name: "Crown" },
      { emoji: "🎩", name: "Top Hat" },
      { emoji: "🎓", name: "Graduation Cap" },
      { emoji: "🔑", name: "Key" },
      { emoji: "🔨", name: "Hammer" },
      { emoji: "🛠️", name: "Hammer & Wrench" },
      { emoji: "🛡️", name: "Shield" },
      { emoji: "⚙️", name: "Gear" },
      { emoji: "⚖️", name: "Balance Scale" },
      { emoji: "🔗", name: "Link" },
      { emoji: "🧪", name: "Test Tube" },
      { emoji: "🧬", name: "DNA" },
      { emoji: "💡", name: "Light Bulb" },
      { emoji: "📚", name: "Books" },
      { emoji: "📂", name: "Open File Folder" },
      { emoji: "📅", name: "Calendar" },
      { emoji: "✉️", name: "Envelope" },
      { emoji: "📝", name: "Memo" },
      { emoji: "📦", name: "Package" },
    ]
  },
  {
    id: "symbols",
    label: "Symbols",
    icon: Music,
    emojis: [
      { emoji: "❤️", name: "Red Heart" },
      { emoji: "🧡", name: "Orange Heart" },
      { emoji: "💛", name: "Yellow Heart" },
      { emoji: "💚", name: "Green Heart" },
      { emoji: "💙", name: "Blue Heart" },
      { emoji: "💜", name: "Purple Heart" },
      { emoji: "🖤", name: "Black Heart" },
      { emoji: "💔", name: "Broken Heart" },
      { emoji: "💖", name: "Sparkling Heart" },
      { emoji: "☮️", name: "Peace Symbol" },
      { emoji: "☯️", name: "Yin Yang" },
      { emoji: "⚛️", name: "Atom Symbol" },
      { emoji: "☣️", name: "Biohazard" },
      { emoji: "☢️", name: "Radioactive" },
      { emoji: "🚫", name: "Prohibited" },
      { emoji: "❌", name: "Cross Mark" },
      { emoji: "⭕", name: "Hollow Red Circle" },
      { emoji: "🛑", name: "Stop Sign" },
      { emoji: "⚠️", name: "Warning" },
      { emoji: "💯", name: "Hundred Points" },
      { emoji: "💬", name: "Speech Balloon" },
    ]
  },
  {
    id: "flags",
    label: "Flags",
    icon: Flag,
    emojis: [
      { emoji: "🏁", name: "Chequered Flag" },
      { emoji: "🚩", name: "Triangular Flag" },
      { emoji: "🎌", name: "Crossed Flags" },
      { emoji: "🏳️", name: "White Flag" },
      { emoji: "🏳️‍🌈", name: "Rainbow Flag" },
      { emoji: "🏴‍☠️", name: "Pirate Flag" },
      { emoji: "🇮🇳", name: "Flag of India" },
      { emoji: "🇺🇸", name: "Flag of USA" },
      { emoji: "🇬🇧", name: "Flag of UK" },
      { emoji: "🇯🇵", name: "Flag of Japan" },
      { emoji: "🇩🇪", name: "Flag of Germany" },
      { emoji: "🇫🇷", name: "Flag of France" },
      { emoji: "🇨🇳", name: "Flag of China" },
      { emoji: "🇧🇷", name: "Flag of Brazil" },
    ]
  }
];

export default function EmojiPicker({ onSelect, onClose }) {
  const [activeTab, setActiveTab] = useState("smileys");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredEmoji, setHoveredEmoji] = useState(null);
  const [history, setHistory] = useState([]);
  
  const pickerRef = useRef(null);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("lms_emoji_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load emoji history", e);
    }
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Handle select & update history
  const handleSelect = (emojiChar) => {
    // Find emoji detail
    let found = null;
    for (const cat of CATEGORIES) {
      const match = cat.emojis.find(e => e.emoji === emojiChar);
      if (match) { found = match; break; }
    }
    if (!found) {
      found = { emoji: emojiChar, name: "Selected Emoji" };
    }

    // Save to history
    const updatedHistory = [found, ...history.filter(h => h.emoji !== emojiChar)].slice(0, 21);
    setHistory(updatedHistory);
    localStorage.setItem("lms_emoji_history", JSON.stringify(updatedHistory));

    onSelect(emojiChar);
  };

  // Get active display category
  const activeCategory = CATEGORIES.find(c => c.id === activeTab);

  // Filter emojis based on search query
  const getFilteredEmojis = () => {
    if (!searchQuery.trim()) {
      if (activeTab === "history") {
        return history;
      }
      return activeCategory ? activeCategory.emojis : [];
    }

    // Flat list filtering for search query
    const results = [];
    const query = searchQuery.toLowerCase();
    CATEGORIES.forEach(cat => {
      cat.emojis.forEach(item => {
        if (item.name.toLowerCase().includes(query)) {
          results.push(item);
        }
      });
    });
    return results;
  };

  const filteredList = getFilteredEmojis();

  // Categories headers bar helper
  const tabIcons = [
    { id: "history", icon: Clock, label: "History" },
    ...CATEGORIES.map(c => ({ id: c.id, icon: c.icon, label: c.label }))
  ];

  return (
    <div 
      ref={pickerRef}
      className="bg-[#1e1e1e] text-white border border-zinc-800 w-[310px] rounded-xl flex flex-col p-3 shadow-2xl z-50 text-left font-sans select-none animate-[fadeIn_0.15s_ease-out]"
    >
      {/* Search Input */}
      <div className="relative mb-2.5 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-800 border border-zinc-700 text-xs rounded-md text-white placeholder-zinc-500 outline-none focus:border-yellow-500 transition-colors"
          />
        </div>
        <div className="w-4 h-4 rounded-md bg-yellow-500 flex-shrink-0" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-800 pb-2 mb-2 justify-between">
        {tabIcons.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !searchQuery;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveTab(tab.id);
              }}
              title={tab.label}
              className={`p-1.5 rounded transition-all cursor-pointer hover:bg-zinc-800/80 ${
                isActive ? "text-yellow-500 bg-zinc-800" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <Icon size={14} />
            </button>
          );
        })}
      </div>

      {/* Emojis Grid Area */}
      <div className="h-44 overflow-y-auto pr-1 flex flex-col scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
        <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2 text-left">
          {searchQuery ? "Search Results" : activeTab === "history" ? "Recently Used" : activeCategory?.label}
        </div>
        
        {filteredList.length === 0 ? (
          <div className="text-zinc-500 text-xs py-8 text-center">
            {activeTab === "history" && !searchQuery ? "No history yet" : "No emojis found"}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {filteredList.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseEnter={() => setHoveredEmoji(item)}
                onClick={() => handleSelect(item.emoji)}
                className="w-9 h-9 flex items-center justify-center text-xl rounded hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                {item.emoji}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Hover Preview Footer */}
      <div className="border-t border-zinc-800 pt-2 mt-2 flex items-center gap-2.5">
        <div className="text-2xl select-none w-9 h-9 bg-zinc-800/40 rounded-lg flex items-center justify-center flex-shrink-0">
          {hoveredEmoji ? hoveredEmoji.emoji : "😊"}
        </div>
        <div className="text-left min-w-0 flex-1">
          <div className="text-[11px] font-bold text-white truncate leading-tight">
            {hoveredEmoji ? hoveredEmoji.name : "What's Your Mood?"}
          </div>
          <div className="text-[9.5px] text-zinc-500 truncate mt-0.5">
            {hoveredEmoji ? "Hovered" : "Choose an emoji for branding"}
          </div>
        </div>
      </div>
    </div>
  );
}
