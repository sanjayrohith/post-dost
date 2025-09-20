# Post-Dost Setup Guide

## 🚀 Quick Start for Contributors

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### 1. Clone and Install
```bash
git clone https://github.com/sanjayrohith/post-dost.git
cd post-dost
npm install --legacy-peer-deps
```

### 2. Environment Setup
```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local and add your values:
# JWT_SECRET=your-super-secret-jwt-key-change-in-production
# NEXT_PUBLIC_APP_URL=http://localhost:3000
# NODE_ENV=development
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Access Application
- Open http://localhost:3000
- The app should load with navigation: Home | Explore | Maps

## 🔧 Troubleshooting

### Issue: "Nothing shows up" / Blank page
**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
npm run dev
```

### Issue: Map not loading
**Solution:**
1. Check browser console for errors
2. Ensure Leaflet CSS is loaded
3. Try refreshing the page

### Issue: React/Leaflet conflicts
**Solution:**
```bash
npm install --legacy-peer-deps
```

### Issue: Build errors
**Solution:**
```bash
npm run type-check
npm run lint
```

## 📦 Key Dependencies
- Next.js 15.5.3
- React 18.3.1
- Leaflet for maps
- Tailwind CSS for styling
- TypeScript

## 🗺️ Maps Feature
- Uses Leaflet (open source)
- No API keys required
- Location-based search
- User location marker

## 🤝 Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push branch: `git push origin feature/your-feature`
5. Create Pull Request

## 📞 Need Help?
If you're still having issues:
1. Check the browser console for errors
2. Ensure you're using Node.js 18+
3. Try clearing browser cache
4. Contact the maintainer