import type { PlaylistData } from './types';

function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function exportCsv(playlist: PlaylistData): string {
  const lines = playlist.tracks.map(
    (t) => `${escapeCsvField(t.title)},${escapeCsvField(t.artist)}`,
  );
  return lines.join('\n') + '\n';
}
