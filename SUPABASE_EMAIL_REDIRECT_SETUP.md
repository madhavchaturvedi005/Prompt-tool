# Supabase Email Redirect Configuration

## Issue
When users click the email confirmation link, they need to be redirected to the login page on your domain.

## Solution

### Step 1: Configure Redirect URL in Supabase Dashboard

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Navigate to Authentication Settings**
   - Click on "Authentication" in the left sidebar
   - Click on "URL Configuration"

3. **Add Redirect URLs**
   Add these URLs to the "Redirect URLs" list:
   ```
   https://www.promptea.dev/login
   https://promptea.dev/login
   http://localhost:5173/login
   ```

4. **Set Site URL**
   Set the "Site URL" to:
   ```
   https://www.promptea.dev
   ```

### Step 2: Configure Email Templates (Optional)

1. **Go to Email Templates**
   - In Authentication settings
   - Click on "Email Templates"

2. **Edit Confirmation Email**
   - Select "Confirm signup" template
   - The confirmation link will automatically use your configured redirect URLs

### Step 3: Test the Flow

1. **Sign up with a new email**
2. **Check your email inbox**
3. **Click the confirmation link**
4. **Should redirect to**: `https://www.promptea.dev/login`
5. **Login with your credentials**

## Current Configuration

The app is already configured to:
- ✅ Detect when user is authenticated after email confirmation
- ✅ Automatically redirect to home page after login
- ✅ Handle the confirmation token from the URL

## Troubleshooting

### Redirect goes to wrong URL

**Problem**: Email link redirects to localhost or wrong domain

**Solution**:
1. Check "Redirect URLs" in Supabase dashboard
2. Make sure your production URL is listed
3. Remove any localhost URLs from production

### 404 Error after clicking email link

**Problem**: Gets 404 when accessing `/login` directly

**Solution**:
- ✅ Already fixed with `_redirects` file for Netlify
- ✅ Already fixed with `vercel.json` for Vercel
- Redeploy your frontend after these files are added

### Email confirmation not working

**Problem**: User clicks link but nothing happens

**Solution**:
1. Check browser console for errors
2. Verify Supabase URL and keys are correct
3. Check that email confirmation is enabled in Supabase

## Files Added

- `public/_redirects` - For Netlify SPA routing
- `vercel.json` - For Vercel SPA routing

These files ensure that direct access to `/login`, `/signup`, etc. works correctly.

## Next Steps

1. ✅ Fix `setShowConfirmation` error - DONE
2. ✅ Add SPA routing configuration - DONE
3. ⚠️ Configure Supabase redirect URLs - DO THIS IN DASHBOARD
4. 🔄 Redeploy frontend with new configuration files
