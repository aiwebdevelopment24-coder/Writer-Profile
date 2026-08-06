/**
 * Converts various YouTube URL formats (watch, shortened, shorts, embed) into standard embed URLs
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  // If already an embed link
  if (trimmed.includes('youtube.com/embed/')) {
    return trimmed;
  }

  // Handle standard watch links (https://www.youtube.com/watch?v=XXXX)
  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&?\/]+)/);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?autoplay=0&rel=0`;
  }

  return null;
}

/**
 * Converts Google Drive share/view links into embeddable PDF preview URLs
 */
export function getEmbeddablePdfUrl(url: string): string {
  if (!url) return '';
  const trimmed = url.trim();

  // If Google Drive link: e.g. https://drive.google.com/file/d/1ABCXYZ/view?usp=sharing
  const driveFileMatch = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }

  // Google Drive open link: https://drive.google.com/open?id=1ABCXYZ
  const driveOpenMatch = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
  if (driveOpenMatch && driveOpenMatch[1]) {
    return `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`;
  }

  return trimmed;
}

/**
 * Checks if a string is a YouTube URL
 */
export function isYouTubeUrl(url: string): boolean {
  if (!url) return false;
  return /youtube\.com|youtu\.be/.test(url);
}
