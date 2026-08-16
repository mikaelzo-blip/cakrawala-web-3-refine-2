# CBL Gearmotor Runtime Direction

Status: active implementation direction for `design/human-art-direction`.

## Decision

The public website does **not** depend on manufacturer CAD.

The homepage gearmotor is an **unbranded technical visualization** built procedurally in WebGL inside `src/components/visuals/IndustrialGearbox3D.tsx`.

This supersedes any earlier assumption that a SEW K77 CAD/GLB file is required for the public runtime.

## Why

- no vendor-logo or nameplate dependency;
- no redistribution/licensing blocker for vendor CAD;
- no additional paid 3D service;
- no Three.js / React Three Fiber dependency for the current implementation;
- individual drivetrain groups can react directly to scroll progress;
- the visual can remain lightweight and responsive.

## Accuracy policy

The visual explains **drivetrain principles**, not an exact manufacturer cutaway.

Public copy must never claim that the internal gears, bearings, seals, tooth counts, shaft geometry, or dimensions are an exact representation of a specific SEW, Nord, Bonfiglioli, Flender, Sumitomo, or other manufacturer unit.

Allowed wording:

- technical drivetrain visualization
- industrial gearmotor principle
- schematic drivetrain principle
- unbranded industrial gearmotor

Avoid:

- exact K77 internals
- genuine manufacturer cutaway
- exact spare-part geometry
- exact bearing/seal part number unless verified from a real unit

## Runtime groups

The WebGL component exposes the story visually as these groups:

1. complete assembly
2. drive motor + adapter
3. input shaft
4. reduction gearing
5. perpendicular / bevel transfer principle
6. bearing set
7. oil seal
8. output shaft
9. housing
10. reassembled system / support transition

## Motion rules

Scroll is vertical only.

- motor separation follows its longitudinal axis;
- housing cover moves along its mechanical axis;
- internals separate only far enough to become readable;
- no random floating;
- no bounce or elastic easing;
- no constant turntable rotation;
- drag interaction may adjust view slightly, but scroll remains the narrative controller;
- `prefers-reduced-motion` uses stepped states instead of continuous interpolation.

## Visual rules

- neutral graphite / warm industrial gray housing;
- machined steel internals;
- dark rubber seals;
- CBL orange/rust only as a selected-component accent;
- no logo;
- no manufacturer text;
- no nameplate;
- no serial number;
- no QR code;
- no fake HUD, telemetry, glass cards, glow, or SaaS gradients.

## Public disclosure

The first story state must make it clear that the visualization is not manufacturer-specific. The model is explanatory editorial content, while actual CBL project photography remains the evidence of completed work.
