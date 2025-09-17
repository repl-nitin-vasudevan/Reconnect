# CLAUDE.md - Deltek India Reconnect 2025 Website Copy

## Project Overview
This is an exact copy of the Deltek India Reconnect 2025 event website, originally hosted at:
https://deltek-india-e-t-india-reconnect-2025-agenda-v1-3-1080946760059.us-west1.run.app/

The website has been recreated for AWS deployment with all functionality, styling, and features preserved.

## Quick Start

### Running Locally
```bash
# Start the development server (auto-finds available port)
python3 serve.py

# Or specify a custom port
python3 serve.py 8080
```

### Deploy to AWS
```bash
chmod +x deploy-to-aws.sh
./deploy-to-aws.sh
```

## Architecture

### Technology Stack
- **Frontend**: React 19.x with ES Modules (no build step required)
- **Styling**: Tailwind CSS (CDN) + Custom CSS
- **Icons**: Lucide React
- **Fonts**: Google Sans Text, Figtree
- **AI Integration**: Google Gemini API
- **Hosting**: AWS S3 + CloudFront CDN

### Key Design Decisions
1. **ES Modules**: Uses native browser ES modules with importmap for dependency management
2. **No Build Process**: Direct browser execution without webpack/vite
3. **Base64 Modules**: JavaScript modules are base64-encoded in importmap
4. **White Background**: Forced white theme (no dark mode) to match original

## Important Files

### Core Files
- `index.html` - Main entry point with all styles and importmap configuration
- `serve.py` - Development server with auto-port detection and proper MIME types
- `deploy-to-aws.sh` - AWS deployment automation script

### JavaScript Structure
```
js/
├── index.js                    # App initialization
├── App.js                      # Main React component
├── constants.js                # Configuration and constants
├── types.js                    # TypeScript type definitions
├── components/
│   ├── IndiaAgenda.js         # Main agenda component (66KB - largest file)
│   ├── SessionModal.js        # Session detail modal
│   ├── SessionCard.js         # Individual session cards
│   ├── Chatbot.js            # AI-powered chatbot
│   ├── HackathonTimer.js     # Countdown timer
│   └── [20+ other components]
└── lib/
    ├── api.js                 # API utilities
    ├── gemini.js             # Google AI integration
    └── eventInfo.js          # Event data management
```

## Brand Colors & Styling

### Deltek Brand Colors
```css
--color-primary: #005684;        /* Deltek Blue */
--color-secondary: #00A9E0;      /* Deltek Light Blue */
--color-info: #00A9E0;          
--color-success: #10b981;        
--color-danger: #ef4444;         
--color-warning: #f59e0b;        
```

### Background Configuration
The website uses a **white background** throughout:
- HTML: `background: white`
- Body: `background-color: #ffffff`
- No dark mode detection or switching

## Key Features

### Implemented Features
- ✅ Multi-day event agenda with tabs
- ✅ Interactive session cards with detailed modals
- ✅ Speaker directory with profiles
- ✅ AI chatbot for event questions
- ✅ Hackathon countdown timer
- ✅ Venue maps (Main Block, Villa, Novotel)
- ✅ Live announcements
- ✅ Personal agenda & favorites
- ✅ Search and filter functionality
- ✅ Volunteer management view
- ✅ Password-protected features

### Component Categories & Colors
Each session category has specific Tailwind color classes:
- Keynote: `bg-purple-100 text-purple-800`
- Development: `bg-blue-100 text-blue-800`
- Consulting: `bg-green-100 text-green-800`
- Support: `bg-yellow-100 text-yellow-800`
- Breakout: `bg-orange-100 text-orange-800`
- Engineering: `bg-indigo-100 text-indigo-800`
- Break: `bg-gray-100 text-gray-800`

## Development Server Details

### Port Management
The server automatically handles port conflicts:
1. Default port: 8000
2. Auto-finds next available port if occupied
3. Manual port specification supported
4. Range checked: 8000-8010

### MIME Types
Proper MIME types for ES modules:
- `.js` files: `application/javascript; charset=utf-8`
- `.mjs` files: `application/javascript; charset=utf-8`

### CORS Headers
Development server includes CORS headers for local testing:
```python
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## AWS Deployment

### S3 Configuration
- Bucket: `deltek-india-reconnect-2025-copy`
- Region: `us-east-1`
- Static website hosting enabled
- Public read access for all objects

### CloudFront CDN
- HTTPS support
- Global edge locations
- Cache optimization for static assets
- Takes 15-20 minutes for full deployment

### URLs After Deployment
- S3: `http://deltek-india-reconnect-2025-copy.s3-website-us-east-1.amazonaws.com`
- CloudFront: `https://[distribution-id].cloudfront.net`

## Common Issues & Solutions

### Port Already in Use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
python3 serve.py 8080
```

### UI Not Matching Original
Ensure these are loaded:
1. Tailwind CSS CDN in index.html
2. Google Fonts (Google Sans Text, Figtree)
3. All CSS variables for Deltek colors
4. White background forced (no dark mode)

### Module Loading Errors
- Check browser console for CORS errors
- Verify importmap paths are correct
- Ensure serve.py is setting proper MIME types

## Testing

### Visual Comparison
Use `visual-test.html` to compare original and copy side-by-side:
```bash
# Start local server first
python3 serve.py

# Open visual test in browser
open visual-test.html
```

### Functionality Checklist
- [ ] All tabs load correctly
- [ ] Session cards are interactive
- [ ] Modals open and close properly
- [ ] Search/filter works
- [ ] Chatbot responds
- [ ] Maps display correctly
- [ ] Timer counts down
- [ ] Favorites can be saved

## File Size Notes
- Total project size: ~500KB
- Largest file: `js/components/IndiaAgenda.js` (66KB)
- All JS modules are base64-encoded in importmap
- No external build artifacts or node_modules

## Security Considerations
- All external resources loaded via HTTPS
- No sensitive data or API keys in code
- CloudFront provides SSL/TLS encryption
- CORS properly configured for production

## Browser Requirements
- Modern browser with ES module support
- Chrome 61+, Firefox 60+, Safari 11+
- JavaScript enabled
- Internet connection for CDN resources

## Maintenance Notes

### Adding New Features
1. Create component in `js/components/`
2. Add to importmap in `index.html`
3. Import in parent component
4. Follow existing React patterns

### Updating Styles
1. Tailwind classes preferred
2. Custom CSS in index.html `<style>` section
3. Maintain Deltek brand colors
4. Keep white background theme

### Deployment Updates
Run deployment script after changes:
```bash
./deploy-to-aws.sh
```
This will sync all changes to S3 and invalidate CloudFront cache.

## Contact & Support
This is a demonstration copy of the original Deltek India Reconnect 2025 website.
For issues with this copy, check the implementation details above.

---
*Last Updated: Current version with white background fix and complete feature parity with original website.*