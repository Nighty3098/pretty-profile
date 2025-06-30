import type { NextApiRequest, NextApiResponse } from 'next';
import { getGithubStats } from '../../utils/github';
import { getTheme } from '../../themes';
import { renderToSVG } from '../../utils/image';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, theme = 'fuji', show = '' } = req.query;
  console.log('[api] username:', username, 'theme:', theme, 'show:', show);

  if (!username || typeof username !== 'string') {
    res.status(400).send('Missing username');
    return;
  }

  const showList = typeof show === 'string' && show.length > 0 ? show.split(',') : [];

  let stats;
  try {
    stats = await getGithubStats(username);
    console.log('[api] stats from GitHub:', stats);
  } catch (e) {
    console.error('[api] ERROR getGithubStats:', e);
    res.status(500).send('Failed to fetch GitHub data');
    return;
  }

  try {
    console.log('[api] Перед вызовом renderToSVG');
    const themeData = getTheme(typeof theme === 'string' ? theme : 'fuji');
    const origin = req.headers.origin || `http://${req.headers.host}`;
    const svg = await renderToSVG({ stats, theme: themeData, show: showList, origin });
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Data-Source', 'github');
    res.status(200).send(svg);
  } catch (e) {
    console.error('[api] ERROR renderToSVG:', e);
    res.status(500).send('Failed to render SVG');
  }
} 
