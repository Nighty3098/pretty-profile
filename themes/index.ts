export type Theme = {
  name: string
  background: string
  backgroundImage?: string
  color: string
  accent: string
}

const themes: Record<string, Theme> = {
  city: {
    name: "city",
    background: "#f5f7fa",
    backgroundImage: "/images/city.png",
    color: "#E6AAAC",
    accent: "#6e7ff3",
  },
  forest: {
    name: "forest",
    background: "#f5f7fa",
    backgroundImage: "/images/forest.png",
    color: "#E0F4E8",
    accent: "#6e7ff3",
  },
  japan: {
    name: "japan",
    background: "#f5f7fa",
    backgroundImage: "/images/jp.png",
    color: "#DDB98C",
    accent: "#6e7ff3",
  },
  night: {
    name: "night",
    background: "#f5f7fa",
    backgroundImage: "/images/night_city.png",
    color: "#FEC639",
    accent: "#6e7ff3",
  },
  waterfall: {
    name: 'waterfall',
    background: '#f5f7fa',
    backgroundImage: '/images/waterfall.jpg',
    color: '#B86538',
    accent: '#6e7ff3',
  },
  mac_bigsur: {
    name: "mac_bigsur",
    background: "#f5f7fa",
    backgroundImage: "/images/mac_bigsur.png",
    color: "#000",
    accent: "#6e7ff3",
  },
  mac_bigsur_dark: {
    name: "mac_bigsur_dark",
    background: "#f5f7fa",
    backgroundImage: "/images/mac_bigsur_dark.png",
    color: "#fff",
    accent: "#6e7ff3",
  },
}

export function getTheme(name: string): Theme {
  if (!themes[name]) {
    console.log(`[themes] Theme '${name}' not found, using 'fuji'`)
  }

  return themes[name] || themes["fuji"]
}
