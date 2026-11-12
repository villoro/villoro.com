// `description` is the category page's meta description and the line under
// its heading: the topic as a whole, not a list of posts.
export const categoryMetadata = {
  AI: {
    name: "🤖 ML/AI",
    color: "#ef4444",
    description:
      "Machine learning and generative AI applied to real problems: training models, working with LLMs, and building agents that run in production.",
  },
  API: {
    name: "🔌 API",
    color: "#f59e0b",
    description:
      "Working with APIs from Python: querying them reliably, respecting their limits, and turning their data into pipelines.",
  },
  DE: {
    name: "⚙️ DE",
    color: "#8b5cf6",
    description:
      "Data engineering from production: building pipelines, processing data at scale, and keeping a data lake fast and cheap.",
  },
  cloud_devops: {
    name: "☁️ Cloud/DevOps",
    color: "#10b981",
    description:
      "Running data workloads in the cloud: infrastructure, automation, deployments, and keeping costs under control.",
  },
  git: {
    name: "🔀 GIT",
    color: "#f97316",
    description:
      "Version control with Git: branching workflows, setup, and fixing a repository's history.",
  },
  hardware: {
    name: "🖥️ Hardware",
    color: "#14b8a6",
    description:
      "Hardware and self-hosting at home: setting up, tuning and maintaining machines and storage.",
  },
  others: {
    name: "📦 Others",
    color: "#6b7280",
    description:
      "Practical guides that don't fit in any other category.",
  },
  python: {
    name: "🐍 Python",
    color: "#eab308",
    description:
      "Writing better Python: clean code, packaging, language features, and making code run faster.",
  },
  tools: {
    name: "🛠️ Tools/Utils",
    color: "#0ea5e9",
    description:
      "The tools around the code: package managers, orchestrators, notebooks and terminals that make day-to-day work easier.",
  },
  web: {
    name: "🌍 Web",
    color: "#ec4899",
    description:
      "Building and serving websites: static sites, design, and putting Python apps on the web.",
  },
} satisfies Record<string, { name: string; color: string; description: string }>;

export type CategoryKey = keyof typeof categoryMetadata;

/** The keys, as the non-empty tuple z.enum() needs: the only valid post `category` values. */
export const categoryKeys = Object.keys(categoryMetadata) as [CategoryKey, ...CategoryKey[]];
