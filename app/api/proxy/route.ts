import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch'; // If using Next.js 13+, you can use native fetch

export default async function handler(req, res) {
  // Allow only GET and OPTIONS
  if (req.method !== 'GET' && req.method !== 'OPTIONS') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // CORS headers
  const origin = req.headers.origin || req.headers.referer || '';
  const originHost = origin ? new URL(origin).host : '';
  const currentHost = req.headers.host;
  const websiteUrl = `${req.headers['x-forwarded-proto'] || 'https'}://${currentHost}`;

  // Only allow same-origin or localhost
  if (originHost !== currentHost && originHost !== 'localhost') {
    res.status(403).json({ error: 'Access denied, domain not allowed.' });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // URL parameter validation
  const url = req.query.url;
  if (!url || typeof url !== 'string') {
    res.status(400).json({ error: 'URL parameter is required' });
    return;
  }

  let validatedUrl;
  try {
    validatedUrl = new URL(url);
  } catch {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    // Fetch the original content
    const fetchRes = await fetch(url, {
      headers: {
        'Referer': 'https://megacloud.club/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'Accept': '*/*'
      },
      redirect: 'follow',
      timeout: 15000,
    });

    const contentType = fetchRes.headers.get('content-type') || 'text/plain';
    const httpCode = fetchRes.status;
    let responseBody = await fetchRes.text();

    if (!fetchRes.ok) {
      res.status(httpCode).json({ error: 'Failed to fetch resource', status: httpCode });
      return;
    }

    // Playlist rewriting for m3u8, mpd, txt
    const ext = validatedUrl.pathname.split('.').pop().toLowerCase();
    const isPlaylist = ['m3u8', 'mpd', 'txt'].includes(ext);

    if (isPlaylist) {
      const baseUrl = url.replace(/[^\/]+$/, '');
      let lines = responseBody.split('\n');
      let processedLines = [];

      for (let line of lines) {
        const trimmed = line.trim();
        // Keep comments and empty lines as-is
        if (!trimmed || trimmed.startsWith('#')) {
          processedLines.push(line);
          continue;
        }
        // Process all lines as potential URLs
        if (trimmed) {
          const fullUrl = trimmed.startsWith('http') ? trimmed : baseUrl.replace(/\/$/, '') + '/' + trimmed.replace(/^\//, '');
          processedLines.push(`${websiteUrl}/api/proxy?url=${encodeURIComponent(fullUrl)}`);
        } else {
          processedLines.push(line);
        }
      }
      responseBody = processedLines.join('\n');

      // DASH (mpd) BaseURL handling
      if (ext === 'mpd') {
        responseBody = responseBody.replace(/<BaseURL>(.*?)<\/BaseURL>/gi, (_, m1) => {
          const full = m1.startsWith('http') ? m1 : baseUrl.replace(/\/$/, '') + '/' + m1.replace(/^\//, '');
          return `<BaseURL>${websiteUrl}/api/proxy?url=${encodeURIComponent(full)}</BaseURL>`;
        });
      }
    }

    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'max-age=3600, public');
    res.status(200).send(responseBody);

  } catch (e) {
    res.status(500).json({ error: 'Internal server error', details: e.message });
  }
  }
