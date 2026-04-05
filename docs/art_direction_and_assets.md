# Art direction and asset production plan

**Purpose:** Lock PS1-style visual language and enumerate MVP art/audio so production runs in parallel without scope drift. Bounds: single courtroom, targets in [`mvp-scope.md`](mvp-scope.md).

---

## 1. Courtroom scene asset list (environment)

| Asset | Description | Notes |
|-------|-------------|--------|
| `env_courtroom_shell` | Single enclosed courtroom interior mesh (walls, floor, ceiling, trims) | One coherent module; **no** second venue |
| `env_lighting_rig` | Key/fill/rim placements (data or empties) for fixed camera presets | PS1-readable contrast; avoid tiny specular highlights |
| `env_floor_material` | Wood or carpet tile texture + low-res normal optional | Tiling allowed; keep seams camera-safe |
| `env_wall_trim` | Wainscoting / wood panel bands as separate material zones or mesh strips | Helps silhouette read at low poly |
| `env_window_bank` | Stylized window wall (non-interactive) | Can be emissive / gradient for sky cheat |
| `env_gallery` | Simple public gallery / back benches if visible in shot | Low detail occluder geometry OK |
| `env_door_props` | Non-openable courtroom doors / clerk table silhouettes | Filler only if in frame |

**Out of MVP for environment:** exterior, hallways, lobby 3D, destructible props, day/night variants.

---

## 2. Character model asset list

| Asset ID | Role / use | MVP geometry |
|----------|------------|----------------|
| `char_prosecution_counsel` | Player Prosecutor stand-in | Single mesh + simple suit silhouette |
| `char_defense_counsel` | Player Defense stand-in | Same rig family as prosecution, different material |
| `char_judge` | Judge at bench | Robe volume readable from bench cam |
| `char_witness` | Generic witness | One base mesh; **variant materials** or hats for archetypes |
| `char_juror` | Juror box population | Shared low-poly rig; palette swap / 2–3 mesh variants |
| `char_defendant` | Defendant at table | Seated pose-friendly mesh |
| `char_bailiff` | Optional background | **Nice-to-have** single static figure |

All characters share **one technical rig spec** (see §5) so animation is pose snaps / limited bones, not feature film.

---

## 3. UI illustrations and evidence art

| Category | Assets | Notes |
|----------|--------|--------|
| **Evidence presentation** | `evidence_frame_default`, category borders (exhibit / digital / chat-log) | Works at small thumbnail size in UI |
| **Case identity** | `case_banner_placeholder` pattern per case (color + sigil strip) | 3–5 cases → reuse frame, swap art |
| **Role callouts** | Small bust silhouettes or icons per role for HUD | Pairs with role badges (§8) |
| **Reactions** | Emoji-adjacent **illustrated** stamps (shock, eye-roll, etc.) optional | Prefer vector-friendly flat shapes |
| **Screenshots-as-evidence** | Author 2D crops in `/public` as texture refs | In-world planes may sample same assets |

**Resolution discipline:** UI atlas targets **≤ 2048×2048** for MVP master atlas (can be split); evidence thumbnails **256×256** or **512×512** source.

---

## 4. PS1 style rules (locked)

1. **Low-poly silhouettes** — readable shape at a glance; avoid micro-detail geometry; favor **hard edges** and chunky forms.
2. **Limited texture resolution** — **≤ 512×512** for character/hero props; **≤ 1024×1024** for large environment spans only where needed; **nearest** or **light bilinear** filtering acceptable; **affine wobble** optional via UV strategy / shader later (not blocking MVP).
3. **Slightly exaggerated proportions** — hands, shoulders, robe volume, witness box stance; **no** photoreal scale.
4. **Strong readable poses** — key poses are **authored** (seated, standing testimony, pointing); avoid subtle idle noise that reads as jitter.
5. **Fixed cinematic camera framing** — assets composed for **known camera presets** (bench, counsel tables, witness, jury, wide); no expectation of 360° hero shots.

**Rendering mood:** high contrast, limited palette per case, subtle dither or film grain **post-MVP** shader optional.

---

## 5. Character rig complexity (MVP)

| Choice | Decision |
|--------|-----------|
| Rig type | **Single shared humanoid skeleton** (≈ 22–28 bones): spine chain, arms, legs, neck, head; **no** face rig for MVP |
| Hands | **Mitten or fused fingers** acceptable; thumbs optional if cheap |
| Facial | **Texture-only** expression (mouth/eye swaps) or **static** face; **no** blendshape library |
| Animation | **Authored key poses** + short blends; procedural = head look-at **nice-to-have** only |
| LOD | **None** for MVP (single mesh per archetype); swap materials for variants |
| Export | **glTF 2.0** (`.glb`) preferred; one skin per character; max **one** UV set per mesh for MVP |

---

## 6. Texture naming and export rules

| Rule | Specification |
|------|----------------|
| Prefix by domain | `tex_env_*`, `tex_char_*`, `tex_ui_*`, `tex_evidence_*` |
| Mesh maps | `*_diff.png` (or `.webp` for web-only UI); **optional** `*_emit.png`; **no** complex PBR stack for MVP unless trivial |
| Resolution | Powers of two; **cap 512×512** characters/props, **1024×1024** large floors/walls only with approval in session log |
| UVs | **0–1**, no overlapping for opaque hero assets; atlas only for tiny trims with consent |
| Naming case | `snake_case` filenames, matching [`repo_layout.md`](repo_layout.md) ID conventions where linked to data |
| Export | Blender: apply scale, freeze transforms; glTF + optional separate `.bin`; embed textures in `.glb` for fewer fetches |

---

## 7. Required courtroom props (MVP geometry)

Each item should exist as **its own named mesh** (can share materials):

| Prop | Purpose |
|------|---------|
| `prop_judge_bench` | Elevated bench + modest architecture read |
| `prop_prosecution_desk` | Counsel surface + chair |
| `prop_defense_desk` | Mirror prosecution layout |
| `prop_witness_stand` | Podium / stand clearly framed for witness cam |
| `prop_jury_box` | Bank of seats / rail read in jury cam |
| `prop_defendant_seat` | Table + chair at counsel side |
| `prop_verdict_signage` | Screen, plaque, or LED strip for verdict beat (can be emissive plane) |

---

## 8. Required 2D UI assets

| Asset group | Deliverables |
|-------------|----------------|
| **Role badges** | Icons for Prosecutor, Defense, Judge, Witness, Juror, Defendant (`ui_badge_*`) |
| **Card frames** | Neutral, prosecutor-tint, defense-tint, objection-reaction frame (`ui_card_frame_*`) |
| **Evidence thumbnails** | Frame + empty slot + “unknown” placeholder (`ui_evidence_*`) |
| **Reaction icons** | Objection spark, sustain, overrule, timer warning (`ui_react_*`) |
| **Verdict stamps** | “GUILTY / NOT GUILTY / HUNG” (or jam-appropriate labels) (`ui_verdict_*`) |

Export **SVG where possible**; otherwise **PNG** with transparency at **1x and 2x** if time allows (MVP can ship **1x** only).

---

## 9. Required sound effects (MVP)

| SFX ID | Use | Notes |
|--------|-----|--------|
| `sfx_gavel_hit` | Phase transitions, judge emphasis | Short dry thwack + tail |
| `sfx_objection_sting` | Objection windows | Punchy, not longer than **1.5s** |
| `sfx_card_play` | Card / action commit | Light tactile click |
| `sfx_witness_reveal` | Witness enters or testimony beat | Short riser or room tone lift |
| `sfx_verdict_sting` | Verdict reveal | Highest drama peak; **avoid** ear fatigue on repeat |

**Format:** **`.ogg`** or **`.mp3`** web-safe; **44.1kHz**, mono acceptable; normalize **–14 LUFS** ballpark for consistency.

---

## 10. Asset production board

### Must-have (blocks first playable polish)

| Domain | Items |
|--------|--------|
| Environment | `env_courtroom_shell`, floor/wall materials, **all seven props** (§7), window bank read |
| Characters | Counsel ×2, judge, witness base, juror base, defendant (**§2**) |
| UI | Card frames, evidence slot, role badges, verdict stamps, basic reaction icons (**§8**) |
| Audio | All five SFX (**§9**) at placeholder quality |
| Visual rules | PS1 rules adhered in review (**§4**); exports per **§6** |

### Nice-to-have (post-first-playable or jam stretch)

| Domain | Items |
|--------|--------|
| Environment | Gallery detail, clerk desk, plants, extra trims |
| Characters | Bailiff, extra juror mesh variants, texture-only expression swaps |
| UI | Full illustration set for every objection type, 2x UI scale pack |
| Shaders | Affine / vertex jitter polish, CRT pass |
| Audio | Music stinger suite, ambient courtroom loop variants |

---

## References

- Product vision: [`01_game_vision.md`](01_game_vision.md)
- MVP bounds: [`mvp-scope.md`](mvp-scope.md)
- Repo paths: [`repo_layout.md`](repo_layout.md) (`/public` texture/model drops)

**Document status:** Vision Phase 3 checklist satisfied when this file ships and checklist items are marked complete in [`01_game_vision_execution_checklist.md`](01_game_vision_execution_checklist.md).
