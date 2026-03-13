# Plan: Apply CSS changes to Hero component overlay

## Overview
Apply CSS styling changes to the Hero component's overlay element to add a background image and adjust positioning.

## Current State
The Hero component (`src/components/Hero.js`) currently has an overlay div that uses CSS module classes for styling. The overlay is positioned absolutely with basic background color.

## Changes Required
Apply the following CSS updates to the Hero component's overlay element:

### Option 1: Update via CSS Module (src/components/Hero.module.css)
Add background image and positioning properties to the `.overlay` class:
- Add `backgroundImage: url(https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2F3de7013a57f749e28ac1200a819e9f22)`
- Add `backgroundRepeat: no-repeat`
- Add `backgroundPosition: center`
- Add `backgroundSize: cover`
- Adjust positioning: `height: 301px`, `left: -322px`, `top: 59px` (if these are absolute values needed)

### Option 2: Add Inline Styles in JSX (src/components/Hero.js)
Modify the overlay div to include inline style props with the new CSS properties.

## Key Files to Modify
- `src/components/Hero.js` — The Hero component containing the overlay div
- `src/components/Hero.module.css` — The CSS module with overlay styling

## Implementation Steps
1. Read the current Hero.js and Hero.module.css to see the exact structure
2. Determine the best approach (CSS module vs inline styles)
3. Apply the CSS changes for the background image and positioning
4. Verify the changes appear correctly in the About page preview

## Questions for User
- Should positioning values (height, left, top) be permanent, or are they specific to the About page view only?
- Should the background image be applied globally to all Hero components, or only to the About page hero?
