# 🚨 Common Issues & Solutions

## Issue: "Nothing shows up" / Blank Page

### Symptoms:
- Browser shows blank/white page
- No content renders
- Console shows errors

### Solutions:

#### 1. **Dependency Issues**
```bash
# Clear everything and reinstall
npm run clean
# OR manually:
rm -rf node_modules package-lock.json .next
npm install --legacy-peer-deps
```

#### 2. **Node.js Version**
```bash
# Check version
node -v
# Should be 18.x or higher
```

#### 3. **Environment Setup**
```bash
# Copy environment file
cp .env.example .env.local
# Edit .env.local and ensure it has:
# JWT_SECRET=your-secret-key
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### 4. **Browser Cache**
- Hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Clear browser cache
- Try incognito/private mode

#### 5. **Port Issues**
```bash
# Try different port
npm run dev -- -p 3001
```

## Issue: Maps Not Loading

### Symptoms:
- Maps page is blank
- "Loading..." spinner doesn't disappear
- Console shows Leaflet errors

### Solutions:

#### 1. **Browser Compatibility**
- Use modern browser (Chrome, Firefox, Safari, Edge)
- Enable JavaScript
- Check if browser blocks location access

#### 2. **Leaflet CSS**
- Check if `leaflet/dist/leaflet.css` is imported in layout.tsx
- Hard refresh the page

#### 3. **SSR Issues**
- Maps use dynamic imports to prevent SSR issues
- If still problematic, try refreshing the page

## Issue: Authentication Not Working

### Symptoms:
- Login/signup doesn't work
- User stays logged out
- JWT errors in console

### Solutions:

#### 1. **JWT Secret**
```bash
# Ensure .env.local has:
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

#### 2. **Browser Storage**
- Clear cookies and localStorage
- Try incognito mode

## Issue: Build Errors

### Symptoms:
- TypeScript errors
- Build fails
- Import errors

### Solutions:

#### 1. **Type Check**
```bash
npm run type-check
```

#### 2. **Lint Check**
```bash
npm run lint
```

#### 3. **Clean Build**
```bash
rm -rf .next
npm run build
```

## 🔍 Diagnostic Tools

Run our diagnostic script:
```bash
npm run diagnose
```

This will check:
- Node.js version
- Dependencies installation
- Environment setup
- Project structure

## 🆘 Still Having Issues?

1. **Check browser console** for specific error messages
2. **Run diagnostic**: `npm run diagnose`
3. **Try clean install**: `npm run clean`
4. **Use automated setup**: `./setup.bat` (Windows) or `./setup.sh` (Linux/Mac)

## 📞 Getting Help

If none of these solutions work:
1. Create an issue on GitHub with:
   - Your operating system
   - Node.js version (`node -v`)
   - Browser and version
   - Complete error messages from console
   - Steps you've tried

2. Include the output of:
   ```bash
   npm run diagnose
   npm run type-check
   ```