export type Theme = {
  name: string
  background: string
  backgroundImage?: string
  color: string
  accent: string
}

export const themes: Record<string, Theme> = {
  city: {
    name: "city",
    background: "#0b1929",
    backgroundImage: "/images/city.png",
    color: "#ffffff",
    accent: "#cd6e86",
  },
  forest: {
    name: "forest",
    background: "#2c363b",
    backgroundImage: "/images/forest.png",
    color: "#9FA49E",
    accent: "#4d5b56",
  },
  japan: {
    name: "japan",
    background: "#1f2c35",
    backgroundImage: "/images/jp.png",
    color: "#d7c8a5",
    accent: "#a43d46",
  },
  night: {
    name: "night",
    background: "#222526",
    backgroundImage: "/images/night_city.png",
    color: "#FEC639",
    accent: "#ff721b",
  },
  waterfall: {
    name: "waterfall",
    background: "#060000",
    backgroundImage: "/images/waterfall.jpg",
    color: "#B86538",
    accent: "#4f4e70",
  },
  ancient: {
    name: "ancient",
    background: "#3c3836",
    backgroundImage: "/images/ancient.png",
    color: "#827468",
    accent: "#427b58",
  },
  solarized: {
    name: "solarized",
    background: "#063542",
    backgroundImage: "/images/solarized.png",
    color: "#85A0AB",
    accent: "#647b83",
  },
  mac_bigsur: {
    name: "mac_bigsur",
    background: "#d1afd1",
    backgroundImage: "/images/mac_bigsur.png",
    color: "#000",
    accent: "#d870a7",
  },
  mac_bigsur_dark: {
    name: "mac_bigsur_dark",
    background: "#8e47ab",
    backgroundImage: "/images/mac_bigsur_dark.png",
    color: "#fff",
    accent: "#4e1293",
  },
  white: {
    name: "white",
    background: "#fff",
    color: "#000",
    accent: "#696969",
  },
  simple: {
    name: "simple",
    background: "#fff",
    backgroundImage: "/images/simple.png",
    color: "#3e3e3e",
    accent: "#6c6c6c",
  },
}

export function createCustomTheme(fg: string, bg: string): Theme {
  return {
    name: "custom",
    background: bg,
    color: fg,
    accent: fg,
  }
}

export function getTheme(name: string, fg?: string, bg?: string): Theme {
  if (name === "custom" && fg && bg) {
    return createCustomTheme(fg, bg)
  }

  if (!themes[name]) {
    console.log(`[themes] Theme '${name}' not found, using 'city'`)
    return themes["city"]
  }

  return themes[name]
}
