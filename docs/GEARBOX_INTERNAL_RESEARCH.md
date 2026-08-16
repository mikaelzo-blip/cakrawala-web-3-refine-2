# K77 Internal Research — Decision Record

## Status
**External geometry:** verified from the downloaded SEW CAD assembly.  
**Internal geometry:** not verified and must not be fabricated as an exact K77 representation.

## Facts supported by SEW documentation
- The selected drive is K77 DRN90L4, mounting position M1, shaft side A.
- K-series gear units in sizes 37–187 use a three-stage architecture.
- K.. is the foot-mounted helical-bevel design with an output shaft with key.
- For K-series sizes 37–187, the standard three-stage direction table states that with clockwise motor rotation, viewed from output end A, the output is counter-clockwise.
- Product-specific spare parts / individual parts lists are obtained through SEW Online Support using the product serial number.

## What the generic CAD does NOT prove
The generic STEP file does not provide enough evidence to claim:
- exact internal tooth counts;
- exact helical-stage gear geometry;
- exact bevel pair geometry;
- bearing manufacturer / bearing part numbers;
- oil-seal part numbers;
- exact internal shaft details;
- product-specific spare part numbers.

## Visual policy
Until product-specific data is available:
1. Exterior housing, motor, adapter, shaft, terminal box and external hardware may be depicted using the SEW CAD.
2. The housing may open and the motor may separate using the verified external geometry.
3. Do **not** show invented internal gears and call them “K77 internals”.
4. If a conceptual internal visual is later required, label it explicitly as a **technical visualization / drivetrain principle**, not an exact K77 cutaway.
5. Preferred route for exact parts: obtain a real K77/DRN90L4 serial number from an installed or owned unit, then use SEW Online Support → Spare parts and accessories → serial-number search → individual parts list / detailed drawings.

## Scene boundary
Blender Scene v1 treats frames **1–85** as the verified exterior chapter.  
Frames **86–145** are intentionally reserved for verified internal content.  
Frames **146–160** reassemble the external model for the transition to the next webpage section.
