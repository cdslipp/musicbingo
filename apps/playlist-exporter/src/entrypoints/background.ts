import type { PlaylistData, ContentMessage, PopupMessage } from '../lib/types';

function updateBadge(playlist: PlaylistData) {
  const have = playlist.tracks.length;
  const total = playlist.totalCount ?? have;
  const complete = have >= total;

  chrome.action.setBadgeText({ text: complete ? String(have) : `${have}↓` });
  chrome.action.setBadgeBackgroundColor({ color: complete ? '#22c55e' : '#f59e0b' });
}

export default defineBackground(() => {
  browser.runtime.onMessage.addListener(
    (message: ContentMessage | PopupMessage, _sender, sendResponse) => {
      if (message.type === 'PLAYLIST_DETECTED') {
        const playlist = message.payload;
        chrome.storage.local.set({ playlist });
        updateBadge(playlist);
        return false;
      }

      if (message.type === 'PLAYLIST_PAGE') {
        chrome.storage.local.get('playlist', (result) => {
          const existing: PlaylistData | undefined = result.playlist;
          if (existing) {
            existing.tracks = [...existing.tracks, ...message.payload.tracks];
            chrome.storage.local.set({ playlist: existing });
            updateBadge(existing);
          }
          sendResponse({ ok: true });
        });
        return true;
      }

      if (message.type === 'GET_PLAYLIST') {
        chrome.storage.local.get('playlist', (result) => {
          sendResponse(result.playlist ?? null);
        });
        return true;
      }

      if (message.type === 'CLEAR_PLAYLIST') {
        chrome.storage.local.remove('playlist');
        chrome.action.setBadgeText({ text: '' });
        return false;
      }
    },
  );
});
