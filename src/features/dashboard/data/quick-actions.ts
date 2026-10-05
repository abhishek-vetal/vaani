export interface QuickAction {
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const QuickActions: QuickAction[] = [
  {
    title: "Narrate a Story",
    description: "Bring characters to life with expressive AI narration",
    gradient: "from-blue-500 to-cyan-400",
    href: "/text-to-speech?text=Long ago, in a quiet village beside the Godavari River, an old potter crafted clay lamps that never seemed to go out. Every Diwali, people traveled from distant towns to buy them. One evening, a curious young girl asked him the secret behind the lamps. The old man smiled and replied, The brightest light always comes from a heart that chooses kindness over pride.",
  },
  {
    title: "Record an Ad",
    description: "Create professional advertisements with lifelike AI voices",
    gradient: "from-rose-500 to-orange-400",
    href: "/text-to-speech?text=Presenting ChaiMitra Premium Tea. Handpicked from the lush gardens of Assam and Darjeeling, every cup delivers rich aroma and unforgettable flavor. Whether it's your morning energy boost or an evening conversation with family, ChaiMitra makes every sip special. Order today and enjoy twenty percent off your first purchase.",
  },
  {
    title: "Direct a Movie Scene",
    description: "Generate dramatic dialogue for film and video",
    gradient: "from-violet-500 to-fuchsia-400",
    href: "/text-to-speech?text=Thunder echoed across the Mumbai skyline as Arjun stepped onto the deserted bridge. You should have trusted me, Maya said, her voice trembling. He looked into her eyes and replied, Sometimes protecting someone means letting them hate you. The rain fell harder as the truth finally came to light.",
  },
  {
    title: "Voice a Game Character",
    description: "Command the streets with gritty, authentic 90s gang dialogue.",
    gradient: "from-amber-500 to-red-500",
    href: "/text-to-speech?text=Listen carefully, rookie. This city belongs to those who earn respect, not those who demand it. Every alley has a story, every corner hides an enemy, and every choice shapes your destiny. Stay sharp, trust your instincts, and remember—legends are never given power. They take it.",
  },
  {
    title: "Introduce Your Podcast",
    description: "Hook your listeners from the very first second",
    gradient: "from-emerald-400 to-teal-500",
    href: "/text-to-speech?text=Namaste and welcome to Voices of India, the podcast where we uncover inspiring stories, groundbreaking innovations, and fascinating people from every corner of the country. I'm your host, and today we're exploring how ordinary individuals are creating extraordinary change in their communities.",
  },
  {
    title: "Guide a Meditation",
    description: "Craft soothing, calming audio for wellness content",
    gradient: "from-indigo-400 to-blue-500",
    href: "/text-to-speech?text=Find a comfortable position and gently close your eyes. Take a slow, deep breath in through your nose, and exhale softly. Imagine yourself sitting beside a peaceful Himalayan river, surrounded by cool mountain air. With every breath, your body relaxes, your mind becomes quieter, and a deep sense of calm fills your heart.",
  },
];