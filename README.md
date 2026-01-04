# GreatDepression2.com - Modern Website

A modern, responsive website recreating the content from greatdepression2.com with integrated PDF viewing capabilities.

## Features

- **Modern Design**: Clean, responsive layout with smooth animations
- **PDF Integration**: View both PDF chapters directly in the browser
- **Smooth Navigation**: Sticky navbar with smooth scrolling
- **Mobile Responsive**: Fully optimized for mobile, tablet, and desktop
- **Interactive Elements**: Hover effects, transitions, and animations
- **Contact Form**: Built-in contact form with validation

## Files

- `index.html` - Main HTML structure
- `styles.css` - Modern CSS styling with animations
- `app.js` - JavaScript for interactivity and PDF viewing
- `docs/Great_Depression_2_Ch_1.pdf` - Chapter 1 PDF
- `docs/Great_Depression_2_Ch_2.pdf` - Chapter 2 PDF

## How to Use

### Local Development

1. Open `index.html` in a modern web browser
2. For best results, use a local server:

#### Using Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Using Node.js (http-server):
```bash
npx http-server -p 8000
```

#### Using VS Code:
- Install "Live Server" extension
- Right-click on `index.html` and select "Open with Live Server"

3. Navigate to `http://localhost:8000` in your browser

### Navigation

- **Home**: Main landing page with hero section
- **GD2 News**: News and updates section
- **Section 1**: Chapter 1 with integrated PDF viewer
- **Section 2**: Chapter 2 with integrated PDF viewer
- **Legal**: Legal information and disclaimers
- **Contact**: Contact form

### PDF Viewing

Click the "View Chapter PDF" buttons to open PDFs in a modal viewer, or use "Download PDF" to save them locally.

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Object-oriented programming with classes
- **PDF.js**: Mozilla's PDF rendering library
- **Google Fonts**: Open Sans and Oswald fonts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Customization

### Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --primary-blue: #53a9db;
    --dark-blue: #336ca6;
    --light-blue: #6bb9e8;
    /* ... */
}
```

### Content

Edit sections in `index.html` to update text and information.

### JavaScript Features

All JavaScript is organized into classes:
- `NavigationHandler`: Manages navigation and scroll effects
- `PDFViewerHandler`: Handles PDF viewing and downloads
- `ContactFormHandler`: Manages contact form submission
- `AnimationHandler`: Controls scroll animations and effects

## Author

David L. Kendig
Rochester, NY
Published: February 27, 2018

## License

All rights reserved. See Legal section on the website for more information.

---

**Modern Implementation**: This website represents a modern rebuild of the original greatdepression2.com with enhanced user experience, mobile responsiveness, and integrated PDF viewing capabilities.
