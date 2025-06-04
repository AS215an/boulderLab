# Boulder Lab Website

This is a climbing gym website with a full-screen navigation menu.

## Project Structure

### Main Files

- `index.html` - Main page with membership listings
- `style.css` - Main stylesheet for the page
- `script.js` - Main JavaScript functionality

### Menu Component (Organized)

- `menu.html` - Full-screen menu HTML structure
- `menu.css` - Menu-specific styling
- `menu.js` - Menu functionality

### Testing

- `test.html` - Simple test page to verify menu functionality

## Recent Improvements

### Typography Updates

1. **BOULDER LAB Title**: Font size 100px, Fira Sans Medium, positioned in top left corner
2. **Section Headers**: Font size 10px, Helvetica Neue Medium (INFORMATION, PRICING, etc.)
3. **Menu Items**: Font size 25px, Helvetica Neue Medium (FAQs, Bookings +, etc.)

### Layout & Spacing Fixes ✅ UPDATED

1. **Grid Layout**: Fixed 3-column layout matching Figma design
   - **Row 1**: INFORMATION | PRICING | CLASSES
   - **Row 2**: YOUTH PROGRAM | EVENTS | Circular Text Element
2. **Spacing**: Perfectly balanced spacing between menu items
   - **Margin**: 2px between list items for optimal separation
   - **Padding**: 3px vertical padding on links for readability
   - **Line Height**: Set to 1.1 for compact yet readable text spacing
3. **Circular Text Animation**: Enhanced positioning and typography
   - **Position**: Moved to top (padding-top: 0px) for highest placement
   - **Size**: Increased to 300px diameter for better visibility
   - **Typography**: 18px Helvetica Neue Bold for bigger, bolder letters
   - **Content**: Single clean message without duplication
   - **Letter Spacing**: Increased to 8px for better word separation
   - **Responsive**: Scales down appropriately on mobile devices
4. **Responsive Design**: Proper mobile stacking for smaller screens

### Code Organization

- Separated menu component into dedicated files for better maintainability
- Improved modular architecture
- Added font fallbacks for better cross-platform compatibility

### Menu Functionality ✅ FIXED

- **Hamburger Menu**: Click to open full-screen overlay menu
- **Close Button**: Click "X CLOSE" to close the menu
- **Background Click**: Click on black background to close
- **Escape Key**: Press Escape to close the menu
- **Link Clicks**: Menu automatically closes when clicking any menu item

## Font Stack

- Primary: Helvetica Neue
- Fallback: Inter (Google Fonts)
- System fallbacks: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, etc.

## How to Run

1. Start a local server: `python3 -m http.server 8000`
2. Open `http://localhost:8000` in your browser
3. Click the hamburger menu to see the full-screen menu

## Testing the Menu

1. Open `http://localhost:8000/test.html` for a comprehensive test page
2. Or use the main page at `http://localhost:8000/index.html`
3. Click the hamburger icon (☰) to open the menu
4. Verify the layout matches the Figma design:
   - Row 1: INFORMATION, PRICING, CLASSES
   - Row 2: YOUTH PROGRAM, EVENTS, Circular Text
   - Tighter spacing between menu items
5. Test closing with:
   - The "X CLOSE" button
   - Clicking on the black background
   - Pressing the Escape key

## Browser Compatibility

- Modern browsers supporting CSS Grid
- Progressive enhancement for older browsers
- Menu works on desktop and mobile devices
