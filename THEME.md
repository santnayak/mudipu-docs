# Mudipu Documentation Theme



## Theme Identity

- **Primary Color**: Red (#dc2626)
- **Font**: JetBrains Mono (all weights)
- **Dark Mode**: Default, matches mudipu-web background (#09090b)
- **Logo**: Red dot in rounded square (consistent across all apps)

## Customizations

### Color Mode
- **Default**: Dark mode
- **Toggle**: Available in navbar
- Dark backgrounds: #09090b (same as mudipu-web)

### Typography
- **All text**: JetBrains Mono
- **Code blocks**: Consistent spacing and line-height
- **Tables**: Red headers in light mode, red-tinted in dark mode

### Components
- **Navbar**: Red accent, mudipu logo (lowercase)
- **Sidebar**: Red active state with left border
- **Links**: Red hover color
- **Admonitions**: Red left border
- **Code**: Red highlighted lines

### Logo
- **Navbar**: 32x32px rounded square with red dot
- **Favicon**: 16x16px version for browser tabs

## Development

```bash
cd mudipu-docs
npm install
npm start
```

## Files Modified

- `src/css/custom.css` - Complete theme overhaul with Mudipu colors and JetBrains Mono
- `static/img/logo.svg` - New logo (red dot design)
- `static/img/favicon.svg` - New favicon matching logo
- `docusaurus.config.js` - Updated navbar, footer, and color mode settings

## Matching Design System

All three apps now share:
- ✅ Red primary color (#dc2626)
- ✅ JetBrains Mono font
- ✅ Dark mode default
- ✅ Consistent logo (red dot + "mudipu")
- ✅ Same scrollbar styling
- ✅ Coordinated navigation between apps
