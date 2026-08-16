# Unbranded Gearmotor Blender Scene v1

## Objective
Create an industrial editorial product sequence using verified external reference geometry from a K77-class helical-bevel gearmotor while keeping the **public visual completely unbranded**.

The source reference may remain documented internally for geometry verification, but the rendered website asset must not present itself as a specific manufacturer product.

## Public identity rules
- no SEW wordmark
- no manufacturer logo
- no nameplate
- no serial label
- no QR code or barcode
- no product marking or fabricated certification label
- no manufacturer-specific marketing copy in the website UI
- use a neutral industrial material treatment rather than manufacturer-identifying color treatment

If the imported source contains a separate label/nameplate object, hide it from viewport and render output rather than recreating or replacing it.

## Frame map

| Frames | State | Verification |
|---|---|---|
| 001–020 | Assembled hero | Verified external reference geometry |
| 021–040 | Slow camera identification | Verified external reference geometry |
| 041–060 | Motor group separates +X | Verified external reference geometry |
| 061–072 | Adapter/interface reveal | Verified external reference geometry |
| 061–082 | Side cover and fasteners open −X | Verified external reference geometry |
| 083–085 | Camera moves toward housing cavity | Verified external reference geometry |
| 086–145 | Internal chapter reserved | **Pending verified source** |
| 146–160 | Reassembly | Verified external reference geometry |

## World axes derived from the reference CAD
- **+X:** gearbox → motor longitudinal direction
- **−Y:** output shaft direction
- **+Z:** vertical/up
- side cover is on the negative-X side of the gearbox

## Materials
Target: neutral industrial product photography.

- Housing: neutral graphite / medium industrial gray, painted cast-metal appearance.
- Motor body: slightly darker neutral gray.
- Output shaft: machined steel.
- Fasteners: darker satin steel.
- Seals, when verified and introduced: dark rubber.

Do not use manufacturer-identifying red as the dominant object color.
Do not use chrome, neon, glassmorphism, fake holographic HUD, or sci-fi glow.
CBL orange belongs to the HTML interface only and should not be painted across mechanical components.

## Camera
- Approx. 62 mm lens.
- Elevated front-quarter view.
- Subtle camera movement only.
- Object motion communicates the mechanical story.
- Avoid continuous showroom turntable behavior.

## Lighting
- Large soft key.
- Controlled rim.
- Gentle fill.
- Charcoal studio background.
- Maintain readable separation between dark mechanical materials and background.

## Internal geometry rule
Frames 086–145 must remain intentionally incomplete until a technically defensible internal reference is available.

Do not invent gears, bearings, seals, shafts, ratios, dimensions, or exploded relationships merely to fill the sequence.

The approved eight-part narrative in `INTERACTIVE_GEARMOTOR_SECTION.md` is the content target, but its visual states should only be implemented when the corresponding mechanical geometry is credible.

## Web strategy
Render still frames later and control frame index from scroll progress. HTML/CSS should carry typography and callout labels so text remains sharp, responsive, accessible, and editable.

The website should describe the result as an **interactive technical overview** or **schematic product study**, not as an exact K77 teardown unless every displayed internal state has been verified.

## Acceptance checks
Before approving a render:
- no visible manufacturer logo or nameplate
- no recognizable manufacturer marketing label remains
- dominant finish is neutral industrial gray
- silhouette and component motion remain mechanically plausible
- no internal geometry is shown beyond the verified boundary
- image still works without decorative UI effects
- mobile crop is checked separately
