import React, { useState, useEffect, useRef } from "react"
import { themes } from "../themes"

const randomStats = {
  name: "John Doe",
  login: "johndoe",
  repoCount: 42,
  stars: 1234,
  followers: 567,
  following: 89,
  issues: 12,
  commits: 3456,
  closedPRs: 78,
  reviews: 9,
  avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
}

const allFields = [
  "repoCount",
  "public_repos",
  "stars",
  "forks",
  "followers",
  "following",
  "public_gists",
  "issues",
  "commits",
  "closedPRs",
  "reviews",
  "name",
  "login",
  "rating_score",
  "rating_percentile",
  "rating_level",
  "rating_name",
]

export default function Home() {
  const [theme, setTheme] = useState("city")
  const [fg, setFg] = useState("#ffffff")
  const [bg, setBg] = useState("#0b1929")
  const [username, setUsername] = useState("User")
  const [hideAvatar, setHideAvatar] = useState(false)
  const [langs, setLangs] = useState(false)
  const [svg, setSvg] = useState<string | null>(null)
  const [copySuccess, setCopySuccess] = useState("")
  const linkRef = useRef<HTMLParagraphElement>(null)
  const [showFields, setShowFields] = useState<string[]>(["repoCount", "stars", "followers", "following", "issues"])
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams({
      theme,
      fg,
      bg,
      hide_avatar: hideAvatar ? "true" : "false",
      langs: langs ? "true" : "false",
      show: showFields.join(","),
    })
    fetch(`/api/preview-banner?${params.toString()}`)
      .then(res => res.text())
      .then(setSvg)
  }, [theme, fg, bg, hideAvatar, langs, showFields])

  const handleCopy = () => {
    if (linkRef.current) {
      const text = linkRef.current.innerText
      navigator.clipboard
        .writeText(text)
        .then(() => {
          setCopySuccess("Copied!")
          setTimeout(() => setCopySuccess(""), 1500)
        })
        .catch(() => setCopySuccess("Failed to copy"))
    }
  }

  const handleFieldChange = (field: string) => {
    setShowFields(prev => (prev.includes(field) ? prev.filter(f => f !== field) : [...prev, field]))
  }

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "750px",
        minWidth: "100px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
        justifyContent: "center",
        gap: "20px",
      }}
    >
      <h1
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          margin: "0px",
          padding: "0px",
        }}
      >
        GENERATE YOUR
        <br />
        PRETTY BANNER
      </h1>
      <h2>Settings:</h2>
      <label className="item">
        <p>Theme:</p>
        <select value={theme} onChange={e => setTheme(e.target.value)}>
          <option key="custom" value="custom">
            Custom
          </option>
          {Object.keys(themes).map(t => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      {theme === "custom" && (
        <>
          <label className="item">
            <p>Foreground color:</p>
            <input type="color" className="color-selector" value={fg} onChange={e => setFg(e.target.value)} />
          </label>
          <label className="item">
            <p>Background color:</p>
            <input type="color" className="color-selector" value={bg} onChange={e => setBg(e.target.value)} />
          </label>
        </>
      )}
      <label className="item">
        <p>Username:</p>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
      </label>
      {!langs && (
        <>
          <label className="item">
            <p>Show avatar:</p>
            <input type="checkbox" className="checkbox" checked={!hideAvatar} onChange={e => setHideAvatar(!e.target.checked)} />
          </label>
        </>
      )}
      <label className="item">
        <p>Languages mode:</p>
        <input type="checkbox" className="checkbox" checked={langs} onChange={e => setLangs(e.target.checked)} />
      </label>
      <button type="button" onClick={() => setShowModal(true)} style={{ marginBottom: 16, width: 180 }}>
        Select fields
      </button>
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              background: "var(--bg2)",
              backdropFilter: "blur(10px)",
              borderRadius: 0,
              padding: 32,
              width: "100vw",
              height: "100vh",
              boxShadow: "var(--shadow)",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Select fields to show</h2>
            <div
              className="grid_1"
              style={{
                display: "grid",
                width: "auto",
                marginBottom: 24,
                gap: 10,
                columnGap: 30,
              }}
            >
              {allFields.map(field => (
                <label
                  key={field}
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignContent: "center",
                    alignItems: "center",
                    textAlign: "left",
                    gap: "8px",
                    fontSize: 15,
                  }}
                >
                  <input type="checkbox" className="checkbox" checked={showFields.includes(field)} onChange={() => handleFieldChange(field)} />
                  {field}
                </label>
              ))}
            </div>
            <button type="button" onClick={() => setShowModal(false)} style={{ marginTop: 8, width: 100 }}>
              Save
            </button>
          </div>
        </div>
      )}
      <h2>Preview</h2>
      {svg && <img src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`} alt="Banner preview" style={{ width: "100%", maxWidth: 750, minWidth: 100 }} />}
      <p ref={linkRef} className="link-paragraph">
        {`https://pretty-profile.vercel.app/api/github-stats?username=${username}`}
        {`&theme=${theme}`}
        {`&hide_avatar=${hideAvatar ? "true" : "false"}`}
        {`&langs=${langs ? "true" : "false"}`}
        {!langs && `&show=${showFields.join(",")}`}
      </p>
      <button type="button" onClick={handleCopy} style={{ marginBottom: 8 }}>
        Copy link
      </button>
      {copySuccess && <span style={{ marginLeft: 8, color: "green" }}>{copySuccess}</span>}
    </div>
  )
}
