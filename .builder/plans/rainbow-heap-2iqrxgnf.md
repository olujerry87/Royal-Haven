# Plan: Add Background Image to Hero Overlay

## Context
The user wants to add background image styling to the overlay div in the Hero component on the About page. The changes include:
- Adding a background image URL
- Setting background-repeat to "no-repeat"
- Setting background-position to "center"
- Setting background-size to "cover"

## Current State
- The overlay div is located in `src/components/Hero.js` (line ~13)
- Styles are currently defined in `src/components/Hero.module.css` (.overlay class)
- The overlay has a semi-transparent dark background: `background: rgba(0, 0, 0, 0.4)`

## Recommended Approach

**Option 1: Add inline styles to the overlay div (matches the provided diff)**
- Modify `src/components/Hero.js`
- Add a `style` prop to the overlay div with the new background image properties
- This allows the image to be passed as a prop, making it flexible per page

**Option 2: Update the CSS class**
- Modify `src/components/Hero.module.css` .overlay class
- Add the background image properties directly to the CSS
- Would require the image URL to be hardcoded in CSS or passed via CSS variables

## Recommended Solution
**Use Option 1** - Add inline styles to the overlay div in Hero.js with the image URL as a configurable prop. This approach:
- Matches the diff the user provided
- Allows the background image to be customized per page (via a prop)
- Maintains flexibility for future changes
- Preserves the existing CSS class styles

## Implementation Steps

1. Read `src/components/Hero.js` to understand the current structure
2. Modify the Hero component to accept a new `overlayImage` prop
3. Add inline styles to the overlay div with the background image and related properties
4. Update `src/app/about/AboutClient.js` to pass the background image URL as the `overlayImage` prop to Hero
5. Test that the image displays correctly on the About page

## Files to Modify
- `src/components/Hero.js` - Add inline styles to overlay div
- Potentially `src/app/about/AboutClient.js` - If passing image as prop

## Key Considerations
- The image URL in the diff (`https://cdn.builder.io/api/v1/image/assets%2F48904b6ada2c4086ab7af82900bb21db%2Ff7dee33d8cd74ba183c59b0e10d0912d`) appears to be specific to the About page
- Decide if this image should be hardcoded or configurable
