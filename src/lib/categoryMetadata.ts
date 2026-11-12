export const categoryMetadata = {
  AI:          { name: "🤖 ML/AI",        color: "#ef4444" },
  API:         { name: "🔌 API",          color: "#f59e0b" },
  DE:          { name: "⚙️ DE",           color: "#8b5cf6" },
  cloud_devops:{ name: "☁️ Cloud/DevOps", color: "#10b981" },
  git:         { name: "🔀 GIT",          color: "#f97316" },
  hardware:    { name: "🖥️ Hardware",     color: "#14b8a6" },
  others:      { name: "📦 Others",       color: "#6b7280" },
  python:      { name: "🐍 Python",       color: "#eab308" },
  tools:       { name: "🛠️ Tools/Utils",  color: "#0ea5e9" },
  web:         { name: "🌍 Web",          color: "#ec4899" },
} satisfies Record<string, { name: string; color: string }>;

export type CategoryKey = keyof typeof categoryMetadata;

/** The keys, as the non-empty tuple z.enum() needs: the only valid post `category` values. */
export const categoryKeys = Object.keys(categoryMetadata) as [CategoryKey, ...CategoryKey[]];
