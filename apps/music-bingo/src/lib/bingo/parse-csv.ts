import Papa from 'papaparse';
import type { Song } from '../types.js';

export function parseCsv(csvText: string): Song[] {
	const { data } = Papa.parse<string[]>(csvText, {
		header: false,
		skipEmptyLines: true
	});

	return data.map((row) => {
		const title = (row[0] ?? '').trim();
		const artist = row[1]?.trim() || undefined;
		return { title, artist };
	}).filter((song) => song.title.length > 0);
}
