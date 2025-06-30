import fetch from "node-fetch"

interface GraphQLResponse {
  data?: {
    user?: {
      avatarUrl: string
      name: string
      login: string
      repositories: {
        totalCount: number
        nodes: Array<{
          stargazerCount: number
          forkCount: number
          issues: {
            totalCount: number
          }
        }>
      }
      followers: {
        totalCount: number
      }
      following: {
        totalCount: number
      }
      gists: {
        totalCount: number
      }
      contributionsCollection: {
        totalCommitContributions: number
        totalPullRequestReviewContributions: number
      }
      pullRequests: {
        totalCount: number
      }
    }
  }
  errors?: Array<{ message: string }>
}

function getAllGithubTokens(): string[] {
  return Object.entries(process.env)
    .filter(([key]) => key.startsWith("GITHUB_TOKEN_PT"))
    .map(([, value]) => value!)
    .filter(Boolean)
}

// Веса и медианы для метрик
const METRICS = {
  commits: { weight: 2, median: 100 },
  prs: { weight: 3, median: 10 },
  issues: { weight: 1, median: 5 },
  reviews: { weight: 2, median: 5 },
  stars: { weight: 4, median: 50 },
  followers: { weight: 2, median: 100 },
}

// Экспоненциальная функция нормализации для commits, prs, issues, reviews
const calcExponentialCDF = (value: number, median: number): number => {
  if (value <= 0) return 0

  return 1 - Math.exp(-value / median)
}

// Логарифмическая функция нормализации для stars, followers
const calcLogNormalCDF = (value: number, median: number): number => {
  if (value <= 0) return 0

  return Math.log(1 + value / median) / Math.log(1 + 1000 / median)
}

// Расчет общего скора
const calculateTotalScore = (metrics: any): number => {
  const scores = {
    commits: calcExponentialCDF(metrics.commits, METRICS.commits.median),
    prs: calcExponentialCDF(metrics.prs, METRICS.prs.median),
    issues: calcExponentialCDF(metrics.issues, METRICS.issues.median),
    reviews: calcExponentialCDF(metrics.reviews, METRICS.reviews.median),
    stars: calcLogNormalCDF(metrics.stars, METRICS.stars.median),
    followers: calcLogNormalCDF(metrics.followers, METRICS.followers.median),
  }

  const totalWeight = Object.values(METRICS).reduce((sum, metric) => sum + metric.weight, 0)
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

  return (totalScore / totalWeight) * 100
}

// Определение уровня по процентилю
const getLevelByPercentile = (percentile: number): { level: string; name: string } => {
  if (percentile <= 1) return { level: "S", name: "Legendary" }
  if (percentile <= 12.5) return { level: "A+", name: "Master" }
  if (percentile <= 25) return { level: "A", name: "Expert" }
  if (percentile <= 37.5) return { level: "A-", name: "Advanced+" }
  if (percentile <= 50) return { level: "B+", name: "Advanced" }
  if (percentile <= 62.5) return { level: "B", name: "Intermediate+" }
  if (percentile <= 75) return { level: "B-", name: "Intermediate" }
  if (percentile <= 87.5) return { level: "C+", name: "Beginner+" }

  return { level: "C", name: "Beginner" }
}

const calculateRating = (stats: any) => {
  const metrics = {
    commits: stats.commits || 0,
    prs: stats.closedPRs || 0,
    issues: stats.issues || 0,
    reviews: stats.reviews || 0,
    stars: stats.stars || 0,
    followers: stats.followers || 0,
  }

  console.log("[rating] Raw metrics:", metrics)

  const score = calculateTotalScore(metrics)

  // Процентиль рассчитывается на основе скора (упрощенная версия)
  // В реальной системе здесь должна быть база данных всех пользователей
  const percentile = Math.max(0, Math.min(100, 100 - score))

  const levelInfo = getLevelByPercentile(percentile)

  console.log("[rating] Score:", score, "Percentile:", percentile, "Level:", levelInfo.level)

  return {
    score: Math.floor(score),
    percentile: Math.floor(percentile),
    level: levelInfo.level,
    name: levelInfo.name,
  }
}

async function getGithubDataGraphQL(username: string, token: string) {
  const query = `
    query($username: String!) {
      user(login: $username) {
        avatarUrl
        name
        login
        repositories(first: 100, isFork: false) {
          totalCount
          nodes {
            stargazerCount
            forkCount
            issues(states: [OPEN, CLOSED]) {
              totalCount
            }
          }
        }
        followers {
          totalCount
        }
        following {
          totalCount
        }
        gists {
          totalCount
        }
        contributionsCollection {
          totalCommitContributions
          totalPullRequestReviewContributions
        }
        pullRequests(first: 100, states: [CLOSED, MERGED, OPEN]) {
          totalCount
        }
      }
    }
  `

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { username },
    }),
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status}`)
  }

  const data = (await response.json()) as GraphQLResponse

  if (data.errors) {
    throw new Error(`GraphQL errors: ${data.errors.map(e => e.message).join(", ")}`)
  }

  return data.data?.user
}

export async function getGithubStats(username: string) {
  const tokens = getAllGithubTokens()
  let lastError: any = null

  for (const token of tokens) {
    try {
      const user = await getGithubDataGraphQL(username, token)

      if (!user) {
        throw new Error("User not found")
      }

      // Подсчитываем статистику по репозиториям
      let stars = 0
      let forks = 0
      let issues = 0

      user.repositories.nodes.forEach(repo => {
        stars += repo.stargazerCount || 0
        forks += repo.forkCount || 0
        issues += repo.issues.totalCount || 0
      })

      const stats = {
        avatar_url: user.avatarUrl,
        name: user.name || user.login,
        login: user.login,
        public_repos: user.repositories.totalCount,
        followers: user.followers.totalCount,
        following: user.following.totalCount,
        stars,
        forks,
        repoCount: user.repositories.totalCount,
        public_gists: user.gists.totalCount,
        issues,
        commits: user.contributionsCollection.totalCommitContributions,
        closedPRs: user.pullRequests.totalCount,
        reviews: user.contributionsCollection.totalPullRequestReviewContributions,
      }

      // Вычисляем рейтинг
      const rating = calculateRating(stats)

      return {
        ...stats,
        rating: {
          score: rating.score,
          percentile: rating.percentile,
          level: rating.level,
          name: rating.name,
        },
        rating_score: rating.score,
        rating_percentile: rating.percentile,
        rating_level: rating.level,
        rating_name: rating.name,
      }
    } catch (e) {
      lastError = e
      // Если это ошибка rate limit, пробуем следующий токен
      if (e instanceof Error && e.message.includes("API rate limit exceeded")) {
        console.warn("[github] Rate limit exceeded for token, trying next...")
        continue
      }
      // Для других ошибок (например, пользователь не найден) сразу выбрасываем
      throw e
    }
  }
  throw lastError || new Error("No valid GitHub tokens found")
}
