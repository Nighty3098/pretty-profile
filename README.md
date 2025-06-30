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
![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=waterfall&show=repoCount,stars,forks,followers,commits,closedPRs)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=waterfall&show=repoCount,stars,forks,followers,commits,closedPRs
```

### Night:
![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=night&show=repoCount,stars,forks,followers,commits,closedPRs)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=night&show=repoCount,stars,forks,followers,commits,closedPRs
```

### Forest:
![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=forest&show=repoCount,stars,forks,followers,commits,closedPRs)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=forest&show=repoCount,stars,forks,followers,commits,closedPRs
```

### Mac OS BigSur
![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur&show=repoCount,stars,forks,followers,commits,closedPRs)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur&show=repoCount,stars,forks,followers,commits,closedPRs
```

### Mac OS BigSur Dark
![](https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur_dark&show=repoCount,stars,forks,followers,commits,closedPRs)

```
https://pretty-profile.vercel.app/api/github-stats?username=Nighty3098&theme=mac_bigsur_dark&show=repoCount,stars,forks,followers,commits,closedPRs
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
- `theme` (optional) — theme name (`city`, `forest`, `japan`, `night`, `waterfall`)
- `show` (optional) — comma-separated list of fields to explicitly show
- `about_me` (optional) — any string to be displayed on the banner (e.g. a short bio or status)

### Example Request
```
GET /api/github-stats?username=octocat&theme=city&show=stars,commits,followers&about_me=Open%20Source%20Enthusiast
```

**Response:** SVG banner with the "city" theme, showing only the fields "stars", "commits", and "followers", and displaying the text "Open Source Enthusiast" on the banner.

---

## Customization

### Themes
- Defined in `themes/index.ts`
- Image resources are in `public/images/`
- You can add new themes and images

### Supported Fields

> You can explicitly show fields using the `show` parameter

- `repoCount`
- `public_repos`
- `stars`
- `forks`
- `followers`
- `following`
- `public_gists`
- `issues`
- `commits`
- `closedPRs`
- `reviews`
- `name`
- `login`
- `rating_score`
- `rating_percentile`
- `rating_level`
- `rating_name`

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
