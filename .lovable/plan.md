
## The Problem
The current hero has two issues making it feel weak:
1. **The 3D scene is off to the right** — the camera angle shows the wireframe room in perspective but it's small, distant, and doesn't fill the space impressively
2. **The layout is purely centered text on top of a dim background** — nothing visually anchors the 3D to the content; it's just floating behind text

## The Solution: Split-Layout Hero with Upgraded 3D

Redesign the hero into a **two-column layout** — text on the left, immersive 3D scene filling the right half. The 3D itself gets a major upgrade: instead of a flat wireframe room seen from far away, we show a **first-person interior perspective** — like standing inside a beautiful room looking at it from a corner angle. Furniture pieces will **materialize one by one** with a draw-in animation, and floating price tag glows will appear next to each piece, directly connecting the 3D to the product concept.

### Layout Change
```text
┌─────────────────────────────────────────────────────┐
│  NAVBAR                                             │
├───────────────────┬─────────────────────────────────┤
│                   │                                 │
│  Badge pill       │   3D Room Scene (fills right)   │
│                   │   - Isometric corner view       │
│  "Design Your     │   - Walls, floor grid visible   │
│   Perfect Space"  │   - Sofa materializes (0.5s)    │
│                   │   - Table materializes (1s)      │
│  Subtext          │   - Lamp materializes (1.5s)     │
│                   │   - Price tags float up (2s)     │
│  CTA buttons      │   - Ambient teal/copper glow    │
│                   │                                 │
│  3 stats bar      │                                 │
└───────────────────┴─────────────────────────────────┘
```

### 3D Upgrades (Scene3D.tsx)
- **Camera**: Move from `[3, 1.5, 5]` to `[2.5, 2, 4]` with tighter FOV (35) for a more dramatic, close perspective
- **Room scale**: Increase from 1.1 to 1.6 for fuller presence
- **Furniture sequencing**: Each piece gets an animated opacity/scale-in using `useFrame` with time-gated reveal (sofa at t>0.5, table at t>1, lamp at t>1.5)
- **Glowing price labels**: Small floating planes near each furniture piece with a pulsing glow — teal for catalog items, copper for price
- **Ambient floor grid**: Add a fine grid on the floor using `GridHelper` concept via line geometry for an architectural blueprint feel
- **Edge quality**: Increase `lineWidth` from 1 to 1.5 for the main room, add subtle glow via a second slightly larger invisible mesh with emissive material

### HeroSection.tsx Changes
- Switch from `flex items-center justify-center` (full-screen centered) to `grid grid-cols-1 lg:grid-cols-2` 
- Left col: text content, left-aligned on desktop
- Right col: the Scene3D canvas fills it completely (h-full, absolute positioned within)
- The background gradient adjusts to fade left (for left col readability) instead of center fade
- Stats bar moves inline below the CTAs

### Files to edit
1. `src/components/Scene3D.tsx` — camera, scale, furniture sequencing, price glow labels, floor grid
2. `src/components/HeroSection.tsx` — split layout, left-aligned text, right-side 3D panel
