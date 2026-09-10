# City in a Tab — V1.3

A fully client-side pixel-art idle city builder for GitHub Pages.

## V1.3 highlights

- Mid-game pacing overhaul: starter housing supports more citizens and population growth is substantially faster.
- Apartments now unlock at 700 population so density arrives before the first progression wall.
- Player-controlled land expansion: 16×16 → 20×20 → 24×24 → 28×28, with population and budget requirements.
- Map scroll/clipping fix: tall maps start at the true top instead of centering rows outside the scrollable area.
- Mayor's Desk expanded to 22 policy decisions, with many more early- and mid-game choices.
- Decision anti-repeat history reduces repetitive Mayor's Desk loops.
- Random city events now arrive roughly every 3–5 minutes after each event rather than every ~1–2 minutes.
- Existing saves migrate automatically to V1.3 and keep their city.
- English/Türkçe localization retained for the new systems and decisions.

## Run locally

Use a local web server rather than opening `index.html` with `file://` if you want to test the PWA/service worker behavior.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages

Upload the project contents to a repository and enable GitHub Pages for the branch/folder you use. All paths are relative and the service worker caches the local assets after the first successful load.


## V1.3.1
- Population now displays current residents / city capacity.
- Population hover explains what capacity means.
- City Pulse now shows the next population-based unlock, including buildings, land expansions, mega projects and Mayor's Desk policies.
- English and Turkish labels are supported for the new progression UI.


## V1.3.2
- Fixed a major stat persistence bug when bulldozing buildings.
- Happiness, traffic, pollution, culture, safety and reputation bonuses from buildings are now derived from the buildings currently on the map.
- Removing a park, road, police station, library, factory, etc. immediately removes that building's stat effect as well.
- Legacy saves are migrated to the new base-stat + building-bonus model; recent pre-V1.3.2 demolition ghost effects are repaired from the city log when possible.


## V1.3.3
- Mayor’s Desk population unlocks now match the Next Unlock tracker exactly.
- Crossing a policy population threshold queues that newly unlocked policy immediately, without waiting for the normal briefing cooldown.
- Regular recurring Mayor’s Desk briefings still use the normal timer after unlock-specific briefs are exhausted.
- Existing saves migrate without dumping already-unlocked historical policies into the queue.


## V1.3.4
- Added a hover/focus Population Growth breakdown to the top population metric.
- The breakdown shows the exact current impact of happiness, pollution, traffic, density trait and over-capacity pressure on the final growth rate.
- Housing/capacity behavior is clarified directly in the tooltip: extra capacity prevents the over-capacity penalty but does not by itself increase the base arrival speed.
- Mayor's Desk timing/progression was not changed in this update.
