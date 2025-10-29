# ConceptBox Frontend

A modern, secure file storage and sharing application built with Vue 3 and Vite.

## Features

- 🔐 **User Authentication** - Register and login with session-based authentication
- 📁 **File Management** - Upload, download, and manage your files
- 🔗 **File Sharing** - Share files with other users and revoke access
- 📥 **Shared Files View** - See all files shared with you by other users
- 📝 **Toggleable Logging** - Comprehensive error logging that can be enabled/disabled
- 🎨 **Modern UI** - Beautiful, responsive interface with clean design

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Pinia** - State management for Vue
- **Vue Router** - Official router for Vue.js

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── AppHeader.vue   # Application header with logout
│   ├── FileCard.vue    # File display card
│   ├── SharedFileCard.vue # Shared file display card
│   └── ShareModal.vue  # File sharing modal
├── views/              # Page components
│   ├── LoginView.vue   # Login page
│   ├── RegisterView.vue # Registration page
│   └── FilesView.vue   # File management page
├── stores/             # Pinia state management
│   ├── auth.js        # Authentication state
│   └── files.js       # Files state
├── services/           # API and utility services
│   ├── api.js         # API client with error handling
│   └── logger.js      # Logging service
├── router/            # Vue Router configuration
│   └── index.js
├── App.vue            # Root component
├── main.js            # Application entry point
└── style.css          # Global styles
```

## API Integration

The app integrates with the ConceptBox backend API. See `PLAN.md` for the complete API specification.

### Key API Conventions

- All endpoints use `POST` method
- Base URL: `/api`
- Session-based authentication
- All requests/responses are JSON

### API Endpoints

**Authentication:**
- `POST /api/UserAuthentication/register` - Register new user
- `POST /api/login` - User login
- `POST /api/logout` - User logout

**File Management:**
- `POST /api/my-files` - List user's files
- `POST /api/my-shares` - List files shared with user
- `POST /api/FileUploading/requestUploadURL` - Request upload URL
- `POST /api/FileUploading/confirmUpload` - Confirm file upload
- `POST /api/download` - Get download URL

**Sharing:**
- `POST /api/share` - Share file with user
- `POST /api/revoke` - Revoke file access

## Logging System

The app includes a comprehensive logging system that logs all API calls and errors.

### Toggle Logging

Click the "📝 Logging ON/OFF" button in the header to enable or disable logging.

Logging is enabled by default and persists across sessions.

### What Gets Logged

- All API requests and responses
- Error messages with context
- Upload/download operations
- Network errors
- Authentication events

Logs include timestamps and contextual information to help with debugging.

## Configuration

### API Proxy

The Vite config includes a proxy for API calls. Update `vite.config.js` to point to your backend:

```js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000', // Your backend URL
      changeOrigin: true
    }
  }
}
```

## Features in Detail

### File Upload

Files are uploaded using a three-step process:
1. Request a presigned upload URL from the backend
2. Upload the file directly to cloud storage
3. Confirm the upload with the backend

This approach enables direct-to-cloud uploads for better performance.

### File Sharing

- Share files with other users by username
- Track who you've shared files with
- Revoke access at any time
- View files shared with you by other users
- See who shared each file with you
- Download shared files
- All sharing operations are logged

### Security

- Session tokens stored in localStorage
- Automatic logout on session expiration
- Protected routes require authentication
- All API errors are properly handled and logged

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Development Notes

### State Management

The app uses Pinia stores for state management:
- `authStore` - Manages user sessions and authentication
- `filesStore` - Manages file listings and operations

### Error Handling

All API calls include comprehensive error handling:
- Network errors
- Authentication errors
- Validation errors
- Server errors

Errors are displayed to users and logged to the console when logging is enabled.

## License

Private project for ConceptBox.

