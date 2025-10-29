# ConceptBox Frontend - Quick Start Guide

## Installation & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Usage Guide

### First Time Setup

1. **Register an Account**
   - Navigate to the registration page
   - Choose a username and password (min 6 characters)
   - Click "Register"

2. **Login**
   - Enter your credentials
   - Click "Login"

### Managing Files

#### Upload a File
1. Click the "+ Upload File" button
2. Select a file from your computer
3. Wait for upload confirmation
4. File appears in your files list

#### Download a File
1. Find the file in your files list
2. Click "⬇️ Download" button
3. File downloads to your browser's download folder

### Sharing Files

#### Share a File
1. Click "🔗 Share" on any file card
2. Enter the username of the person to share with
3. Click "Share"
4. The username appears in the "Shared with" list

#### Revoke Access
1. Open the share modal for a file
2. Find the username in "Shared with" list
3. Click "Revoke" next to their name
4. Confirm the action

### Logging

#### Toggle Logging On/Off
- Click the "📝 Logging ON/OFF" button in the header
- When ON: All API calls and errors are logged to the browser console
- When OFF: Logging is disabled
- Setting persists across sessions

#### View Logs
1. Open browser developer tools (F12)
2. Go to the Console tab
3. Look for emoji-prefixed log entries:
   - ❌ API Error
   - ⚠️ Warning
   - ℹ️ Info
   - ✅ Success

## API Error Logging

Every API call is logged with:
- Context (what operation was being performed)
- Error message
- Timestamp
- Request details
- Response status

### Example Log Entries

**Successful Upload:**
```
✅ Success: {
  context: "Complete File Upload",
  message: "File upload completed successfully",
  timestamp: "2025-10-29T12:34:56.789Z",
  filename: "document.pdf",
  fileId: "f3cde45f-6789-0123-b4c5-d6e7f8a9b0c1"
}
```

**Failed Login:**
```
❌ API Error: {
  context: "User Login",
  error: "Invalid username or password",
  timestamp: "2025-10-29T12:34:56.789Z",
  endpoint: "/login",
  status: 401
}
```

**Network Error:**
```
❌ API Error: {
  context: "List My Files",
  error: "Network error - cannot reach server",
  timestamp: "2025-10-29T12:34:56.789Z",
  endpoint: "/my-files"
}
```

## Configuration

### Backend URL

Update the backend URL in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',  // Change this to your backend URL
      changeOrigin: true
    }
  }
}
```

## Troubleshooting

### Can't login after registration
- Make sure you're using the same username and password
- Check browser console for error messages (enable logging)

### Upload fails
- Check file size (ensure backend supports the size)
- Enable logging to see detailed error messages
- Check network tab in browser dev tools

### Files not loading
- Ensure you're logged in
- Check backend connection
- Look for errors in console (enable logging)

### Session expired
- Log out and log back in
- Sessions are stored in localStorage and persist across page refreshes

## Development Tips

### Hot Module Replacement (HMR)
- Changes to `.vue` files auto-reload
- Changes to stores/services may require manual refresh
- CSS changes update instantly

### State Management
- Auth state in `stores/auth.js`
- Files state in `stores/files.js`
- State persists in Pinia stores

### Adding New Features
1. API calls go in `services/api.js`
2. Components go in `components/` or `views/`
3. Routes go in `router/index.js`
4. Always use the logger for error tracking

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

Preview production build:
```bash
npm run preview
```

## Support

For API questions, refer to `PLAN.md` which contains the complete API specification.

