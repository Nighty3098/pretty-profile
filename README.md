# pretty-profile

**pretty-profile** is a server-side application based on Next.js for generating SVG banners with a user's GitHub statistics. Banners are customizable with themes and display key metrics of a user's GitHub activity.

---

## Features

- Generate SVG banners with GitHub statistics
- Customizable themes (background, colors, images)
- Flexible control over displayed fields (repositories, stars, forks, followers, commits, etc.)
- Support for multiple GitHub API tokens to bypass rate limits

---

## Usage

### Waterfall:

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=waterfall)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=waterfall
```

### Night:

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=night)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=night
```

### Forest:

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=forest)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=forest
```

### Mac OS BigSur

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur
```

### Mac OS BigSur Dark

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur_dark)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur_dark
```

### Custom

![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=custom&fg=%23000000&bg=%236a55e8)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=custom&fg=%23000000&bg=%236a55e8
```

---

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   In the project root, create a `.env.local` file and add your GitHub tokens:

   ```env
   GITHUB_TOKEN_PT1=ghp_...
   GITHUB_TOKEN_PT2=ghp_...
   # ...
   ```

3. **Run in development mode:**

   ```bash
   npm run dev
   ```

4. **Production build:**

   ```bash
   npm run build
   npm start
   ```

---

## API Usage

### Endpoint

```
GET /api/github-stats
```

### Query Parameters

- `username` (required) — GitHub username
- `theme` (optional) — theme name (`city`, `forest`, `japan`, `night`, `waterfall`, `mac_bigsur`, `mac_bigsur_dark`, `custom`)
- `show` (optional) — comma-separated list of fields to explicitly show
- `about_me` (optional) — any string to be displayed on the banner (e.g. a short bio or status)
- `fg` (optional) — foreground (text) color for custom theme (e.g. "#ffffff")
- `bg` (optional) — background color for custom theme (e.g. "#000000")

### Example Request

```
GET /api/github-stats?username=octocat&theme=city&show=stars,commits,followers&about_me=Open%20Source%20Enthusiast
```

### Custom Theme Example

```
GET /api/github-stats?username=octocat&theme=custom&fg=%23ffffff&bg=%23000000&show=stars,commits,followers
```

**Response:** SVG banner with custom colors, where text is white (#ffffff) and background is black (#000000)

---

## Customization

### Themes

Defined in `themes/index.ts`

Image resources are in `public/images/`

You can add new themes and images

- city
- forest
- night
- waterfall
- mac_bigsur
- mac_bigsur_dark

### Supported Fields

> You can explicitly show fields using the `show` parameter

- repoCount
- public_repos
- stars
- forks
- followers
- following
- public_gists
- issues
- commits
- closedPRs
- reviews
- name
- login
- rating_score
- rating_percentile
- rating_level
- rating_name

---

## Technologies

- Next.js (API routes)
- TypeScript
- satori (SVG rendering)
- node-fetch (GitHub API)
- Custom themes and fonts

---

## Project Structure

- `pages/api/github-stats.ts` — main API endpoint
- `utils/github.ts` — GitHub API integration, metrics and rating calculation
- `utils/image.tsx` — SVG banner generation
- `themes/index.ts` — theme definitions
- `public/images/` — images for themes
- `public/fonts/` — custom font for banners

---

## License

MIT
