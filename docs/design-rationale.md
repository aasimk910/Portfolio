# Design Rationale — Aasim Khan Portfolio

**Last updated:** 2026-10-23
**Scope:** The current single-page site (`src/App.jsx` → `src/components/creator/`), which replaced the earlier HUD/dashboard version.

**Who it's for:** Recruiters and internship reviewers in cybersecurity and software, plus game-dev peers. A typical visitor spends under two minutes on the page, often on a phone opened from a LinkedIn or GitHub link.

**Page goals, in priority order:**
1. Make it obvious within one screen who Aasim is and what Aasim works on (security + full-stack + game dev).
2. Get the visitor to a project's source code.
3. Get the visitor to send an email.

> **About the evidence:** No user research or analytics informed these decisions yet. The evidence is established design principles, the content Aasim actually has (four GitHub projects, no screenshots, no product metrics), and the code itself. Each decision has a validation step so it can be checked against real behaviour later.

---

## D1. Rebuild on a creator-portfolio layout instead of the HUD dashboard

**Decision:** Replace the dashboard-style site (Navbar, ThreatRadar, FloatingTerminal, FloatingStatusHUD, FloatingBinaryRain, GitHubProjects) with a linear, scroll-driven layout: Hero → Skills marquee → About → Loadout → Projects → Contact. Keep the cyber identity through the visual skin, not through extra widgets.

**Context:** The earlier version had many floating, always-on widgets competing for attention. A portfolio's job is to deliver a few facts in a set order, and a dashboard has no reading order.

**Options considered:**
- **A. Keep the HUD dashboard and trim widgets.** Strong theme, but still no single reading path.
- **B. Plain résumé-style page.** Clear, but says nothing about the game-dev and design side.
- **C. Story-driven scroll layout with a cyber/gamer skin (chosen).**

**Reasoning:** C gives a fixed order that matches the page goals (identity → skills → proof → contact) and keeps the personality. Visual hierarchy comes from scale and sequence instead of many glowing panels fighting each other.

**Trade-offs:**
- Less "wow" from live-looking radar and terminal widgets.
- The old components are still in `src/components/` but no longer imported. They add maintenance noise and should be deleted or archived.

**Validation:** In 5-second tests with 3–5 peers or mentors, can they say what Aasim does after seeing only the hero? Target: at least 4 of 5 mention both "security" and "games".

---

## D2. Use game vocabulary as the section language

**Decision:** Name sections in game terms: skills are an **Inventory** of item cards with class tags (`[SEC]`, `[WEB]`, `[GAME]`, `[LANG]`, `[TOOL]`), services are a **Loadout**, projects are **Quests completed**, and the contact section says **Player 2 ready?**. HUD lines (`STATUS: LEARNING | LOC: KATHMANDU, NP`) use the mono font.

**Context:** Aasim's profile spans two areas that rarely appear together: offensive/network security and Unity game development. A generic "Skills / Services / Work" structure would make the game work look like a side hobby.

**Options considered:**
- **A. Standard section labels only.** Easy to scan, no personality.
- **B. Hacker-terminal metaphor everywhere** (`$ cat about.txt`). Only signals security.
- **C. Game metaphor in the micro-copy, with plain big headings (chosen).**

**Reasoning:** Following Jakob's Law, the large headings stay conventional ("About me", "Projects", "Let's talk"), so scanning works as on any portfolio. The game language sits in the small HUD lines and the card tags, where it adds flavour without hiding where anything is. Hacker cues (the `aasim@kali` prompt, scanlines, the keyhole shield) carry the security side, so both identities show up together.

**Trade-offs:** The tone is playful. A conservative enterprise security reviewer may read it as less serious. "Loadout" as a big heading is the one place the metaphor replaces a standard label.

**Validation:** Ask 2–3 security professionals whether the tone hurts credibility. If it does, swap "Loadout" for "What I do" and keep the rest.

---

## D3. CSS-3D layered SVG instead of 3D renders or WebGL

**Decision:** Build all illustrations as inline SVG and give them depth with CSS 3D (`perspective`, `preserve-3d`, `translateZ`), not images or WebGL.
- **Hero emblem:** about 20 stacked SVG layers. Sixteen neon slices form the shield's walls, the face sits on top, the circuit traces and keyhole float in front, and two orbit rings sit on tilted planes that pass through the shield. The whole thing turns toward the pointer (`Tilt global`) and sways slowly when the pointer is still.
- **About icons:** `Extrude` stacks darkened copies of each flat icon behind it for real thickness, and the icons turn to follow the pointer.
- **Supporting depth:** skill cards and project art tilt with a glare highlight, and their inner parts sit at different depths. The skill rows lean back like a conveyor belt. Covered project cards lean back as the next card stacks on top. Headings are extruded with stacked drop-shadows. The contact button has a physical bottom edge that presses down.

**Context:** The creator template this layout is based on relies on PNG 3D renders. Aasim has no 3D renders, and heavy images slow first paint on mobile networks in Nepal. A later request asked for the site to feel "more 3D".

**Options considered:**
- **A. Commission or generate 3D PNG renders.** Rich, but static, costly, and hundreds of KB.
- **B. Real-time 3D (three.js / react-three-fiber).** True geometry and lighting, but roughly 150 KB+ more gzipped JS, a loading delay before the hero appears, and battery and GPU cost on phones.
- **C. CSS-3D on stacked SVG layers (chosen).**

**Reasoning:** C gives real parallax and thickness that react to the pointer, for almost no page weight (the CSS grew by about 3 KB, and the JS by only the `Tilt` and `Extrude` helpers). It stays sharp at any size and takes its colours from the palette. The slices behind the shield are scaled up to cancel perspective shrink; without that, the side walls hid behind the face at normal tilt angles. Every illustration is `aria-hidden`.

**Trade-offs:**
- This is layered flat art, not true geometry. At steep angles the slices can show as steps.
- There is no lighting model; shading is baked into the colours of each layer.
- Pointer tilt only runs on fine pointers (mouse or trackpad). Touch visitors get the idle sway and the fixed 3D angles.
- Under reduced motion, everything stops moving and the emblem stays at a fixed 3D angle.
- About 20 composited layers in the hero plus about 9 per About icon. Fine on desktop, but worth profiling on low-end Android.

**Validation:** Lighthouse mobile performance ≥ 90, Largest Contentful Paint < 2.5 s on simulated 4G, and no dropped frames in a Chrome performance trace while moving the pointer over the hero on a mid-range phone.

---

## D4. Colour system: near-black base, neon green accent, magenta gradient CTA, colour-coded skill classes

**Decision:**
- Base `#0C0C0C`, text `#D7E2EA`.
- `--accent: #00FF88` for HUD text, links, focus and the cursor.
- A magenta-purple-orange gradient (`--c-rgb`) used **only** on the primary "Contact Me" / "Send a Message" button.
- Five skill-class colours (green SEC, blue WEB, purple GAME, yellow LANG, orange TOOL) on cards and project art.

**Context:** The palette has to signal "security" (terminal green) and "gaming" (RGB/neon) without turning into a rainbow.

**Reasoning:**
- **Von Restorff Effect:** the gradient appears nowhere else, so the contact button is always the most distinctive thing on screen. That supports Goal 3.
- **Law of Similarity:** a class colour means the same thing everywhere (green always means security), so the marquee works as a legend for the project cards.
- Main text on the base passes WCAG AA by a wide margin (about 14:1). On the light Loadout block, the dark green HUD text `#0B7A45` was chosen instead of `#00FF88` to keep contrast above 4.5:1.

**Trade-offs:** Five hues plus green plus the gradient is near the upper limit. Yellow and orange are close enough that colour-blind visitors may confuse LANG and TOOL. The text labels (`[LANG]`) prevent this from causing a real error.

**Validation:** Run every text/background pair through a contrast checker, and check the marquee in a deuteranopia simulator.

---

## D5. One light block (Loadout) in an otherwise dark page

**Decision:** The Loadout section uses a light background (`#F2F5F3`) with a rounded top edge. The Projects section then overlaps it with its own rounded dark edge (`-mt-10`).

**Context:** A long all-dark page with neon accents flattens out. Every section starts to look alike, and visitors lose track of where they are.

**Reasoning:** A single change in background tells the visitor they have moved from "who I am" to "what I can do for you". The overlapping rounded edges (Law of Common Region) make Projects feel like a new layer sliding over the previous one. This sets up the stacking-card effect in D6.

**Trade-offs:** Visitors in dark rooms will see a sudden bright flash, and the gamer theme is weaker in this section.

**Validation:** In session recordings or watched walkthroughs, check whether visitors scroll through Loadout or skip it. If most skip it, shorten it to three items.

---

## D6. Sticky stacking project cards with a terminal panel and glyph art, no screenshots

**Decision:** Each project is a large rounded card that sticks to the top of the viewport and shrinks slightly as the next card stacks over it. A card holds: a big index number, a category tag in the project's colour, a description, tech chips, a fake `git clone` terminal, a glyph "cover" (`repo.exe`), and a **View Code** button. A final **All Repositories** button follows the cards.

**Context:** The four projects are code repositories (a weather app, two Unity games, a MERN app). None has polished screenshots, and the goal is to get visitors into the code (Goal 2).

**Options considered:**
- **A. Grid of thumbnails.** Needs screenshots that don't exist. Empty thumbnails look unfinished.
- **B. Live GitHub API list** (the old `GitHubProjects.jsx`). Always current, but reviewers can't tell which repos matter, and it fails when rate-limited.
- **C. Curated stacking cards (chosen).**

**Reasoning:** Curation means a reviewer sees the best four, in a chosen order, with context. The sticky stack gives each project a full screen, one at a time, so they don't compete. The fake terminal ends with the repo URL, which makes "this is code you can clone" concrete and leads to the View Code button.

**Trade-offs:**
- Glyphs (☁ ☠ ✦ ✈) don't show the actual product. Adding real screenshots or GIFs to the art panel would be stronger, especially for the two games.
- The terminal panel is hidden below 640 px, so mobile visitors see less context.
- Stacking cards make a long scroll on phones (75vh per card).
- Adding projects means editing code, not a CMS.

**Validation:** Track outbound clicks per **View Code** button, for example with UTM parameters or a privacy-friendly analytics tool. If projects 3–4 get far fewer clicks than 1–2, reorder the cards or cut the stack height.

---

## D7. Motion: expressive on desktop, restrained under reduced-motion

**Decision:** Use motion as the main way to show craft: entrances fade and slide in (`FadeIn`), the hero emblem drifts toward the pointer (`Magnet`), the About text lights up character by character as you scroll (`AnimatedText`), the skill rows slide with scroll, and a lagging crosshair replaces the cursor (`CustomCursor`). All framer-motion primitives check `useReducedMotion`, and the CSS loops are turned off under `prefers-reduced-motion`.

**Context:** Aasim presents as both a developer and a game developer. Polished motion is evidence of the "playable things" claim in the hero. Under the aesthetic-usability effect, visitors also judge a polished site as more competent.

**Reasoning:** Each effect is tied to scroll or pointer input, not left running on its own, so the visitor stays in control. The single shared easing curve (`EASE = [0.25, 0.1, 0.25, 1]`) and similar durations (0.7–0.9 s) keep the motion consistent.

**Trade-offs and known gaps:**
- **Custom cursor:** `cursor: none` hides the system pointer on mouse devices. Because the crosshair trails the real pointer, its position differs from the true click point during fast movement. This works against Fitts's Law precision and is the riskiest decision on this list. Touch devices fall back to the normal cursor correctly.
- **About text** starts at 20% opacity (about 1.6:1 contrast) until scrolled. Screen readers get the full text through `aria-label`, but a sighted visitor who stops scrolling sees text that is barely readable.
- **Skill marquee** moves with scroll even when the visitor has asked for reduced motion; its scroll listener doesn't check the preference. This should be fixed.

**Validation:** Test with the OS "reduce motion" setting turned on and confirm nothing moves on its own. Watch 3 people use the site with a mouse and note any misclicks near the nav or buttons. If misclicks happen, remove the cursor lag or bring back the system cursor.

---

## D8. Email is the only contact path, offered three times

**Decision:** Contact is a `mailto:` link, with no form. The gradient contact button appears in the hero, after About, and in the footer, together with the plain email address and six social links.

**Context:** It's a static site with no backend. A form would need a third-party service and spam protection.

**Reasoning:** Recruiters already work from their email client, so `mailto:` is the shortest path. The visible address helps people on machines without a mail client configured, since they can copy it. Repeating the CTA at the three natural decision points (first impression, after the bio, end of page) means visitors never have to scroll back to find it. The footer's "Player 2 ready?" ending applies the peak-end rule: the last moment invites the visitor in.

**Trade-offs:** There is no way to measure contact intent, because mailto clicks are invisible without analytics. Six social links split attention. Instagram and Facebook add little for professional reviewers.

**Validation:** Count emails that mention the portfolio each month. Consider trimming the social links to GitHub, LinkedIn, and Discord.

---

## Open follow-ups

| # | Item | Related decision |
|---|------|------------------|
| 1 | Make the skill marquee's scroll motion respect `prefers-reduced-motion` | D7 |
| 2 | Decide whether to keep the lagging custom cursor after watching mouse users | D7 |
| 3 | Add real screenshots or GIFs for Purano Bhudimau and Customer Pickup | D6 |
| 4 | Delete the unused legacy components from the dashboard version | D1 |
| 5 | Add privacy-friendly analytics so the validation steps can actually run | D6, D8 |
