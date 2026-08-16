# Gearbox Chapter Pipeline

Status: locked design/asset direction for branch `design/human-art-direction`.

## Canonical visual reference

- Gear unit family: SEW-EURODRIVE K series helical-bevel gear unit.
- Visual size target: K77-class housing.
- Motor reference: DRN90L4.
- Purpose: canonical visual geometry for storytelling, not a claim that CBL sells one exact SKU.
- Do not invent internal mechanical geometry with generative AI.

## Source-of-truth asset workflow

1. Open SEW-EURODRIVE Online Support > Data & Documents > CAD data.
2. Search using the product type designation.
3. Complete product specification and generate CAD data.
4. Prefer a neutral B-Rep CAD export such as STEP when it is offered. Use IGES only as fallback.
5. Keep the original CAD archive unchanged under a local source-assets folder; do not commit licensed/raw vendor CAD to the public website repository unless redistribution rights are confirmed.
6. Open the CAD file in Open Cascade CAD Assistant.
7. Verify the assembly tree, object names, colors and part separation before conversion.
8. Export a working copy as binary glTF (`.glb`). GLB is the preferred Blender handoff because it can preserve assembly structure, names and render-oriented materials better than OBJ/STL.
9. Import GLB into Blender 4.5 LTS.
10. Validate scale against a known SEW dimension sheet before applying transforms. Do not guess or manually eyeball scale.

## Why not OBJ or STL as primary handoff

- STL is geometry-only and discards assembly/material semantics.
- OBJ is acceptable as an emergency fallback for static mesh geometry, but has much weaker scene/assembly semantics.
- GLB is preferred for the Blender working handoff.

## Blender project standard

Use one Blender LTS version for the full production sequence.

Suggested collection structure:

```
GEARBOX_MASTER
├── 00_REFERENCE
├── 01_HOUSING
├── 02_MOTOR
├── 03_INPUT
├── 04_INTERMEDIATE_STAGE
├── 05_BEVEL_STAGE
├── 06_OUTPUT
├── 07_BEARINGS_SEALS
├── 08_FASTENERS
├── 09_LABEL_HELPERS
├── LIGHTS
└── CAMERAS
```

Object naming must be semantic. Do not leave objects named `Object.001`, `Mesh.042`, etc.

Examples:

```
GBX_HOUSING_MAIN
GBX_HOUSING_COVER
MOTOR_BODY
INPUT_SHAFT
GEAR_STAGE_01
GEAR_STAGE_02
BEVEL_PINION
BEVEL_GEAR
OUTPUT_SHAFT
BEARING_OUTPUT_A
SEAL_OUTPUT
```

## Geometry cleanup rules

- Preserve mechanical proportions from CAD.
- Do not remesh aggressively before the first validation render.
- Remove duplicate/internal geometry only after confirming it is visually irrelevant.
- Keep separate pieces separate when they participate in exploded motion.
- Combine only truly static repeated fasteners when doing so does not break the exploded sequence.
- Fix shading/normals before material work.
- Use bevel/smoothing only when it improves render quality without altering engineering geometry.

## Material direction

Target: restrained industrial product photography.

- Housing: painted cast iron; slightly desaturated industrial finish.
- Shafts: machined steel.
- Gears: machined steel, controlled roughness.
- Bearings: darker steel variation.
- Fasteners: satin steel.
- Avoid chrome, neon, holographic and cyberpunk treatments.

## Camera direction

- Product-photography perspective, not ultra-wide.
- Target equivalent focal length: roughly 50–70 mm.
- Slight elevated three-quarter view.
- Camera movement must be slow, deliberate and mechanically readable.
- Avoid constant turntable rotation.

## Lighting direction

- Large soft key light.
- Narrow restrained rim light.
- Soft fill.
- Dark charcoal/navy environment rather than absolute black.
- No colored neon glow, smoke or excessive volumetrics.

## Exploded-story component groups

The public story should expose approximately eight readable groups rather than every service-level part:

1. AC motor
2. Motor/input interface
3. Input shaft and pinion
4. First/intermediate gear stage
5. Intermediate shaft
6. Bevel gear pair
7. Output shaft and bearings
8. Housing and seals

Exploded motion must follow mechanical axes. Parts must not fly outward randomly.

## 160-frame master sequence

Use a deterministic 160-frame source sequence that can later be sampled or compressed for web delivery.

| Frames | Story state | Motion intent |
|---|---|---|
| 001–020 | Assembled hero | Minimal camera settle; complete product readable |
| 021–040 | Identify | Slow camera orbit; motor and output annotations become possible |
| 041–060 | Input separation | Motor/input interface separates along its real axis |
| 061–085 | Housing open | Cover/housing moves away without arbitrary rotation |
| 086–110 | Internal stages reveal | Gear/shaft groups separate just enough to read hierarchy |
| 111–130 | Bevel focus | Lighting/camera emphasizes 90-degree power transfer |
| 131–145 | Serviceable components | Bearings, seal, shaft, gear set and coupling become individually readable |
| 146–160 | Reassembly/transition | Return toward assembled state and transition toward real project context |

No bounce, elastic easing, random floating or mouse-following movement.

## Render master

Render a high-quality master sequence first. Web optimization happens after visual approval.

Initial production target:

- Master aspect ratio: 16:9 desktop composition with enough safe area for responsive cropping.
- Separate mobile framing pass; do not simply scale desktop composition down.
- Transparent background only if compositing benefits outweigh edge/fringing risks; otherwise render against final controlled background.
- Keep frame numbering zero-padded: `gearbox_0001` ... `gearbox_0160`.

Suggested local working structure:

```
assets-source/gearbox/
├── vendor-cad/
├── converted/
├── blender/
├── references/
├── renders-master/
├── renders-web/
└── notes/
```

Do not place large source CAD or Blender files in the public Next.js bundle.

## Web delivery rules

- Website uses pre-rendered frames, not heavy realtime CAD geometry.
- Scroll progress maps deterministically to frame index.
- Desktop and mobile may use different crops/frame sets.
- Provide a reduced-motion fallback using one or a few static keyframes.
- Do not load all high-resolution frames at initial page load; staged/preload strategy must be implemented during frontend integration.

## Visual anti-slop guardrails

Never add these merely to make the section look "premium":

- floating glass cards
- pill badges
- purple/blue SaaS gradients
- giant blur blobs
- fake telemetry
- decorative HUD interfaces
- random icons
- generic AI industrial copy
- physically impossible exploded geometry

The visual hierarchy should come from object scale, typography, photography, spacing and precise motion.

## Acceptance checklist before frontend implementation

- [ ] CAD source is traceable to official/vendor documentation.
- [ ] Redistribution/licensing of any shipped vendor assets has been checked.
- [ ] Scale is validated against a known dimension.
- [ ] Main assembly groups are semantically named.
- [ ] Internal/exploded movement is mechanically plausible.
- [ ] Hero, open housing and bevel-focus keyframes each work as standalone still images.
- [ ] Mobile framing is separately approved.
- [ ] Reduced-motion still is selected.
- [ ] No raw CAD is shipped to the browser.
- [ ] No AI-generated mechanical geometry is used as engineering truth.
