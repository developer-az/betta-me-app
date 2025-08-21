# Deployment Troubleshooting Guide

## Common "Unknown internal error" Issues

### 1. **Environment Variables Missing**
Your deployment platform needs these environment variables:
```
REACT_APP_SUPABASE_URL=https://apesehqjztvperbrywax.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your_anon_key_here
```

### 2. **Build Command Issues**
Make sure your deployment platform is using:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Node Version**: 18+ (recommended)

### 3. **File Size Limits**
Some platforms have file size limits. Your current build is:
- Main JS: 145.14 kB (within limits)
- CSS: 5.31 kB (within limits)

### 4. **Memory Issues**
If building on the platform fails:
- Increase build memory (if available)
- Use `npm ci` instead of `npm install`
- Clear cache before deployment

### 5. **Domain/CORS Issues**
Update your Supabase settings:
1. Go to Supabase Dashboard > Authentication > Settings
2. Add your deployment URL to:
   - **Site URL**: `https://your-deployed-app.com`
   - **Redirect URLs**: `https://your-deployed-app.com/**`

## Platform-Specific Fixes

### Vercel
```json
// vercel.json (create this file if needed)
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### Netlify
```toml
# netlify.toml (create this file if needed)
[build]
  command = "npm run build"
  publish = "build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Cloudflare Pages
- **Build Command**: `npm run build`
- **Build Output**: `build`
- **Root Directory**: (leave empty)

## Quick Fixes to Try

1. **Clear deployment cache** on your platform
2. **Redeploy** from scratch
3. **Check build logs** for specific error messages
4. **Verify environment variables** are set correctly
5. **Test locally** with `npm run build && npx serve build`

## If Still Failing

1. **Check platform status pages** for ongoing issues
2. **Try a different deployment platform** temporarily
3. **Contact platform support** with build logs
4. **Deploy to a subdirectory** if main domain has issues

## Local Testing
To test your production build locally:
```bash
npm run build
npx serve -s build -l 3000
```

Then test authentication and all features work correctly.
