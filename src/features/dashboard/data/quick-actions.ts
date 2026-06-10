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
    gradient: "from-cyan-500 via-sky-300 to-slate-50",
    href: "...",
  },
  {
    title: "Record an Ad",
    description: "Create professional advertisements with lifelike AI voices",
    gradient: "from-rose-400 via-pink-300 to-rose-50",
    href: "...",
  },
  {
    title: "Direct a Movie Scene",
    description: "Generate dramatic dialogue for film and video",
    gradient: "from-violet-500 via-fuchsia-300 to-purple-50",
    href: "...",
  },
  {
    title: "Voice a Game Character",
    description: "Command the streets with gritty, authentic 90s gang dialogue.",
    gradient: "from-amber-500 via-orange-300 to-amber-50",
    href: "...",
  },
  {
    title: "Introduce Your Podcast",
    description: "Hook your listeners from the very first second",
    gradient: "from-indigo-500 via-blue-300 to-indigo-50",
    href: "...",
  },
  {
    title: "Guide a Meditation",
    description: "Craft soothing, calming audio for wellness content",
    gradient: "from-lime-400 to-lime-100",
    href: "...",
  },
];