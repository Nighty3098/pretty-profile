import satori from 'satori';
import type { Theme } from '../themes';
import fs from 'fs';
import path from 'path';

interface RenderParams {
  stats: any;
  theme: Theme;
  show?: string[];
  origin: string;
}

// Загружаем шрифт Oswald один раз при старте
const fontPath = path.resolve(process.cwd(), 'public/fonts/IosevkaNerdFont-Bold.ttf');
const fontExists = fs.existsSync(fontPath);
console.log('[satori] Font exists:', fontExists, fontPath);
const fontData = fontExists ? fs.readFileSync(fontPath) : undefined;

const FIELD_LABELS: Record<string, string> = {
  repoCount: 'Repos',
  public_repos: 'Repos',
  stars: 'Stars',
  forks: 'Forks',
  followers: 'Followers',
  following: 'Following',
  public_gists: 'Gists',
  issues: 'Issues',
  commits: 'Commits',
  closedPRs: 'Closed PRs',
  reviews: 'Reviews',
  name: 'Name',
  login: 'Login',
  rating_score: 'Rating Score',
  rating_percentile: 'Rating Percentile',
  rating_level: 'Rating Level',
  rating_name: 'Rating Name',
};

export async function renderToSVG({ stats, theme, show = [], origin }: RenderParams): Promise<string> {
  console.log('[satori] stats:', stats);
  console.log('[satori] theme:', theme);

  const allFields = [
    'repoCount',
    'public_repos',
    'stars',
    'forks',
    'followers',
    'following',
    'public_gists',
    'issues',
    'commits',
    'closedPRs',
    'reviews',
    'name',
    'login',
    'rating_score',
    'rating_percentile',
    'rating_level',
    'rating_name',
  ];
  const defaultFields = ['repoCount', 'stars', 'followers', 'following', 'issues'];
  let fieldsToShow: string[];
  if (show.length > 0) {
    fieldsToShow = show.filter(f => allFields.includes(f));
  } else {
    fieldsToShow = defaultFields;
  }

  // Абсолютный путь к картинке
  const bgUrl = theme.backgroundImage ? origin + theme.backgroundImage : undefined;

  try {
    return await satori(
      <div
        style={{
          width: 1500,
          height: 600,
          background: bgUrl ? `url(${bgUrl})` : theme.background,
          backgroundSize: '1500 600',
          backgroundPosition: 'center',
          color: theme.color,
          fontFamily: 'Iosevka Nerd Font',
          borderRadius: 70,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 100,
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Overlay для затемнения фона */}
        {bgUrl && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              borderRadius: 70,
              zIndex: 1,
            }}
          />
        )}
        {/* Левая часть: контент */}
        <div
          style={{
            width: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            position: 'relative',
            zIndex: 2,
            gap: 16,
          }}
        >
          {/* User info */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          </div>
          {/* Stats container */}
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'flex-start',
              color: theme.color,
            }}
          >
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start', color: theme.color }}>
              {fieldsToShow.map((field) => (
                typeof stats[field] !== 'undefined' && (
                  <div key={field} style={{ display: 'flex', flexDirection: 'row', width: '800', justifyContent: 'space-between', color: theme.color, fontSize: '35px', fontWeight: 'bolder' }}>
                    {FIELD_LABELS[field] || field}: <b>{stats[field]}</b>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
        {/* Правая часть: аватар */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', position: 'relative', zIndex: 2, width: '0px' }}>
          <img
            src={stats.avatar_url}
            width={400}
            height={400}
            style={{
              borderRadius: '50%',
              marginBottom: 0,
              border: `0px solid ${theme.accent}`,
            }}
          />
        </div>
      </div>,
      {
        width: 1500,
        height: 600,
        fonts: fontData
          ? [
              {
                name: 'Iosevka Nerd Font',
                data: fontData,
                weight: 700,
                style: 'normal',
              },
            ]
          : [],
      }
    );
  } catch (e) {
    console.error('[satori] ERROR:', e);
    throw e;
  }
} 
