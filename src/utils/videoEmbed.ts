export function parseVideoEmbedUrl(
  url: string,
  type: 'youtube' | 'vimeo' | 'upload',
): string | null {
  if (type === 'upload') return url;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    if (type === 'youtube' || host.includes('youtube.com') || host === 'youtu.be') {
      let videoId = '';
      if (host === 'youtu.be') {
        videoId = parsed.pathname.slice(1).split('/')[0];
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1]?.split('/')[0] || '';
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1]?.split('/')[0] || '';
      } else {
        videoId = parsed.searchParams.get('v') || '';
      }
      return videoId
        ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
        : null;
    }

    if (type === 'vimeo' || host.includes('vimeo.com')) {
      const segments = parsed.pathname.split('/').filter(Boolean);
      const id = segments[segments.length - 1];
      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function detectVideoProvider(url: string): 'youtube' | 'vimeo' | 'upload' {
  const lower = url.toLowerCase();
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return 'youtube';
  }
  if (lower.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'upload';
}
