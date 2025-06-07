# Boulder Lab Website

A modern climbing gym website featuring a full-screen navigation menu and membership listings.

## Project Structure

```
boulderLab/
├── index.html          # Main membership page
├── style.css           # Main stylesheet
├── script.js           # Main page functionality
├── menu.html           # Menu component structure
├── menu.css            # Menu styling
├── menu.js             # Menu functionality
├── cart.css            # Shopping cart styles
└── Images/             # Image assets
```

## Features

### Navigation Menu

- **Full-screen overlay menu** with hamburger toggle
- **3-column responsive layout**:
  - Row 1: INFORMATION | PRICING | CLASSES
  - Row 2: YOUTH PROGRAM | EVENTS | Circular Text Animation
- **Multiple close methods**: Close button, background click, or Escape key
- **Circular text element** with animated rotating text

### Typography

- **BOULDER LAB Title**: 100px Fira Sans Medium
- **Section Headers**: 10px Helvetica Neue Medium
- **Menu Items**: 25px Helvetica Neue Medium
- **Font Stack**: Helvetica Neue → Inter → System fonts

### Layout

- **Responsive design** for desktop and mobile
- **Grid-based membership cards** with hover effects
- **Ticker banner** with scrolling announcements
- **Clean, modern aesthetic**

## Quick Start

1. **Start local server**:

   ```bash
   python3 -m http.server 8000
   ```

2. **Open in browser**:

   ```
   http://localhost:8000
   ```

3. **Test the menu**:
   - Click the hamburger icon (☰) to open
   - Verify the 3-column layout matches design
   - Test closing with button, background click, or Escape key

## File Organization

### Core Files

- **index.html** - Main page with membership listings and header
- **style.css** - Global styles, layout, and component styling
- **script.js** - Main page interactions and functionality

### Menu Component

- **menu.html** - Standalone menu HTML structure
- **menu.css** - Menu-specific styles and animations
- **menu.js** - Menu toggle functionality and event handlers

### Additional

- **cart.css** - Shopping cart component styles

## Browser Support

- Modern browsers with CSS Grid support
- Progressive enhancement for older browsers
- Responsive design for mobile devices

## Development Notes

- Modular component architecture for maintainability
- Semantic HTML structure for accessibility
- Optimized font loading with fallbacks
- Clean separation of concerns (HTML/CSS/JS)
