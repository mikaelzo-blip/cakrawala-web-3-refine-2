# Gearmotor Internal Research — Decision Record

## Status
**External geometry:** verified from a real K77-class CAD reference used only as an internal geometry source.  
**Public identity:** unbranded. No manufacturer logo, wordmark, nameplate, serial label, QR code, or manufacturer-specific product claim.  
**Exact internal geometry:** not verified and must not be fabricated as an exact manufacturer representation.

## What the external reference supports
The external reference is sufficient for:
- credible motor / gearbox proportions;
- housing silhouette;
- motor adapter relationship;
- output-shaft location;
- terminal-box and external-hardware positioning;
- mechanically plausible external separation axes.

These facts are useful for visual composition but do not justify an exact internal teardown claim.

## What the generic external CAD does NOT prove
The source does not provide enough evidence to claim:
- exact internal tooth counts;
- exact helical-stage gear geometry;
- exact bevel-pair geometry;
- exact bearing manufacturer or part numbers;
- exact oil-seal part numbers;
- exact internal shaft geometry;
- exact gear ratios represented by the visual;
- product-specific spare-part numbers.

## Locked public direction
The website will use a **hybrid technical-visualization approach**:

1. **Exterior chapter:** unbranded external gearmotor geometry derived from a verified physical reference.
2. **Open-housing transition:** only verified external shell / cover movement.
3. **Internal chapter:** an explicitly generic **schematic drivetrain principle**, not an exact K77 cutaway.
4. **Reassembly:** return to the unbranded exterior model before transitioning to real CBL project documentation.

This route is preferred because the website's goal is to explain how a gearmotor system works and how CBL approaches maintenance / replacement discussions — not to publish a manufacturer's proprietary teardown.

## Schematic internal rules
A conceptual internal visual may show these readable engineering groups:

1. drive motor / motor interface
2. input shaft
3. first reduction stage
4. intermediate shaft / reduction stage
5. right-angle bevel stage
6. output shaft
7. bearing locations
8. sealing / housing relationship

The schematic must follow physically plausible axes and transmission flow, but it must not present invented values as manufacturer facts.

### Never display as factual data
- gear tooth counts
- reduction ratios
- RPM values
- torque values
- bearing model numbers
- seal model numbers
- exact dimensions
- lubricant specifications
- manufacturer spare-part codes

Unless independently verified from a real unit/document, omit them.

## Required public wording
Use wording such as:
- `Interactive technical overview`
- `Schematic drivetrain visualization`
- `Mechanical transmission principle`

Avoid:
- `Exact K77 internals`
- `OEM cutaway`
- `Manufacturer teardown`
- `Genuine internal configuration`

## Visual behavior
- internal groups separate only along mechanically understandable axes;
- gear engagement remains visually understandable;
- bearing and seal locations remain close to their operating positions;
- no random floating exploded parts;
- no neon glow, holographic HUD, or fake telemetry;
- active parts may use restrained contrast, outline, or material shift;
- CBL orange belongs primarily to HTML/interface accents, not to painting the internal mechanism orange.

## Scene boundary
Blender Scene v1 keeps frames **1–85** as the verified exterior chapter.  
Frames **86–145** may now be developed as a clearly labeled **schematic drivetrain visualization** rather than an exact K77 internal representation.  
Frames **146–160** reassemble the external model for transition to the next webpage section.

## Exact-parts route, if ever required
If CBL later needs exact product-specific internals for a real maintenance case, obtain the real unit's serial/product information and use manufacturer documentation / individual parts lists. That future workflow is separate from the generic public website visualization.
