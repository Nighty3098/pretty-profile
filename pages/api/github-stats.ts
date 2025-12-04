import type { NextApiRequest, NextApiResponse } from "next"

import { getTheme } from "../../themes"
import { getGithubStats } from "../../utils/github"
import { renderToSVG } from "../../utils/image"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, theme = "city", show = "", about_me = "", fg = "", bg = "", hide_avatar = "false", langs = "false" } = req.query
  const usernameStr = String(username)
  const themeStr = String(theme)
  const showStr = String(show)
  const aboutMeStrLog = String(about_me)
  const fgStr = String(fg)
  const bgStr = String(bg)
  const langsStr = String(langs)
  console.log(`[api] username: ${usernameStr}, theme: ${themeStr}`)
  console.log(`[api] show: ${showStr}, about_me: ${aboutMeStrLog}`)
  console.log(`[api] fg: ${fgStr}, bg: ${bgStr}, langs: ${langsStr}`)

  if (!username || typeof username !== "string") {
    res.status(400).send("Missing username")

    return
  }

  const showList = typeof show === "string" && show.length > 0 ? show.split(",") : []
  const aboutMeStr = typeof about_me === "string" ? about_me : ""
  const fgColor = typeof fg === "string" ? fg : ""
  const bgColor = typeof bg === "string" ? bg : ""
  const langsFlag = langs === "true"

  let stats
  try {
    stats = await getGithubStats(username)
    console.log("[api] stats from GitHub:", stats)
  } catch (e) {
    console.error("[api] ERROR getGithubStats:", e)
    res.status(500).send("Failed to fetch GitHub data")

    return
  }

  try {
    console.log("[api] renderToSVG")
    const themeData = getTheme(typeof theme === "string" ? theme : "city", fgColor, bgColor)
    const origin = req.headers.origin || `http://${req.headers.host}`
    const svg = await renderToSVG({
      stats,
      theme: themeData,
      show: showList,
      origin,
      about_me: aboutMeStr,
      hide_avatar: hide_avatar === "true",
      langs: langsFlag,
    })
    res.setHeader("Content-Type", "image/svg+xml")
    res.setHeader("Cache-Control", "public, max-age=1800")
    res.setHeader("X-Data-Source", "github")
    res.status(200).send(svg)
  } catch (e) {
    console.error("[api] ERROR renderToSVG:", e)
    res.status(500).send("Failed to render SVG")
  }
}
