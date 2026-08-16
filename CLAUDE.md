# Development & Agent Reference - CV Cakrawala Buana Lestari (CBL)

Refer to `AGENTS.md` for full project specifications, corporate brand system, contact info, and component guidelines.

## Mandatory Visual Design References
Before redesigning or implementing any visual section, read:

1. `DESIGN_DIRECTION.md` — site-wide human-led art direction and anti-AI-slop rules.
2. `INTERACTIVE_GEARMOTOR_SECTION.md` — required narrative, interaction, engineering credibility, mobile behavior, and motion rules for the interactive gearmotor experience.
3. `docs/GEARMOTOR_RUNTIME.md` — active runtime decision: procedural, unbranded WebGL visualization with no vendor-CAD dependency.

Do not replace these directions with generic SaaS/card-based patterns. Do not invent project claims, manufacturer identity, mechanical specifications, or visual content that has not been verified.

For the public homepage, do not reintroduce SEW branding, a manufacturer nameplate, serial/QR markings, or a vendor-specific internal-geometry claim. Manufacturer CAD research may remain as internal reference material, but it is not required by the runtime.

## Quick Commands
- Typecheck: `npx tsc --noEmit`
- Dev Server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
