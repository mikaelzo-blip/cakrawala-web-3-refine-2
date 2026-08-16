# K77 Blender Scene v1

## Objective
Create an industrial editorial product sequence using the official external K77 DRN90L4 CAD assembly, without inventing internal geometry.

## Frame map

| Frames | State | Verification |
|---|---|---|
| 001–020 | Assembled hero | Verified external CAD |
| 021–040 | Slow camera identification | Verified external CAD |
| 041–060 | Motor group separates +X | Verified external CAD |
| 061–072 | Adapter/interface reveal | Verified external CAD |
| 061–082 | Side cover and its fasteners open −X | Verified external CAD |
| 083–085 | Camera moves toward housing cavity | Verified external CAD |
| 086–145 | Internal chapter reserved | **Pending verified source** |
| 146–160 | Reassembly | Verified external CAD |

## World axes derived from the CAD
- **+X:** gearbox → motor longitudinal direction
- **−Y:** output shaft direction
- **+Z:** vertical/up
- Side cover is on the negative-X side of the gearbox.

## Materials
- Housing and motor: muted RAL3020-style red, rough painted cast-metal appearance.
- Output shaft: machined steel.
- Fasteners: darker satin steel.
- No chrome, neon, glassmorphism, fake holographic HUD, or sci-fi glow.

## Camera
- Approx. 62 mm lens.
- Elevated front-quarter view.
- Subtle camera movement only; object motion communicates the mechanical story.

## Lighting
- Large soft key.
- Controlled rim.
- Gentle fill.
- Charcoal studio background.

## Web strategy
Render still frames later and control the frame index from scroll progress. HTML/CSS should carry typography and callout labels so text remains sharp, responsive, accessible, and editable.
