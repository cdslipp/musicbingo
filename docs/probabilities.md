# Bingo Probability Notes

## Card Uniqueness

Each card selects 24 songs from the pool (ignoring position/order). The number of possible unique song sets is "n choose 24" where n = total songs.

| Songs | Possible unique sets | 100 cards saturates | 1000 cards saturates |
|-------|---------------------|---------------------|----------------------|
| 24 | 1 | 100% | 100% |
| 25 | 25 | 100% | 100% |
| 30 | 593,775 | 0.02% | 0.17% |
| 40 | 62,852,101,650 | ≈0% | ≈0% |
| 50 | 1.26 × 10^14 | ≈0% | ≈0% |

With 40+ songs, duplicate card sets are essentially impossible. If duplicates appeared in the old app, it was likely a shuffling/RNG bug, not a combinatorial inevitability.

**Position matters too**: two cards with the same 24 songs but different cell positions play differently (different winning lines). The current uniqueness check hashes by song *set* (sorted titles), so same-songs-different-positions are flagged as "duplicates" even though they'd behave differently in gameplay.

## Simultaneous Winners (Ties)

Ties happen when two or more cards complete a winning line on the exact same song call. The current simulation handles this correctly — all cards are checked on each call before stopping.

### What affects tie probability?

- **Number of cards**: more cards = more chances for ties. With 50 cards ties are uncommon; with 200+ they happen regularly.
- **Win condition**: "row" wins happen earlier (fewer calls needed), meaning less divergence between cards — slightly higher tie chance. "Full card" requires so many calls that multiple cards tend to finish near each other, but the exact-same-call overlap is harder to predict.
- **Song pool size**: fewer songs means cards share more songs, increasing correlation between cards and making ties more likely.

### Rough intuition for "row" condition

A typical row win happens around call 14–18 with 40 songs. On any given call near that range, each card has roughly a 2–5% chance of completing a row. With 200 cards, the expected number of cards completing a row on a given call is ~4–10, making ties very likely.

With 50 cards, the expected number per call is ~1–2.5, so ties happen but less frequently — maybe 20–40% of games.

## Future Ideas

- **Batch simulation mode**: run N simulations and report tie frequency, average calls to win, distribution of winner counts. This would give concrete stats for planning bingo nights (e.g., "with 200 cards and row condition, expect ties in ~60% of games").
- **Position-aware uniqueness**: optionally check that cards differ not just in song set but in cell arrangement, since position affects gameplay.
