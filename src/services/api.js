/**
 * API Service for ConceptBox
 * All endpoints use POST method as per API specification
 */

import { logger } from './logger'

const API_BASE = '/api'

/**
 * Get MIME type based on file extension
 */
function getContentType(filename, defaultType = '') {
  const ext = filename.split('.').pop().toLowerCase()
  
  const mimeTypes = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    'ico': 'image/x-icon',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'txt': 'text/plain',
    'csv': 'text/csv',
    'rtf': 'application/rtf',
    
    // Video
    'mp4': 'video/mp4',
    'mov': 'video/quicktime',
    'avi': 'video/x-msvideo',
    'mkv': 'video/x-matroska',
    'webm': 'video/webm',
    'flv': 'video/x-flv',
    'wmv': 'video/x-ms-wmv',
    'mpeg': 'video/mpeg',
    'mpg': 'video/mpeg',
    
    // Audio
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav',
    'ogg': 'audio/ogg',
    'flac': 'audio/flac',
    'aac': 'audio/aac',
    'm4a': 'audio/mp4',
    'wma': 'audio/x-ms-wma',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/vnd.rar',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
    'bz2': 'application/x-bzip2',
    'xz': 'application/x-xz',
    
    // Code/Text
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'xml': 'application/xml',
    'md': 'text/markdown',
    
    // Other
    'bin': 'application/octet-stream'
  }
  
  // Return the MIME type if found, otherwise use provided default, or fall back to octet-stream
  return mimeTypes[ext] || defaultType || 'application/octet-stream'
}

/**
 * Base fetch wrapper with error handling and logging
 */
async function apiCall(endpoint, body = {}, context = 'API Call') {
  const url = `${API_BASE}${endpoint}`
  
  logger.info(context, `Calling ${endpoint}`, { body })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json()

    if (!response.ok) {
      // API error response with error status code
      const errorMessage = data.error || 'Unknown error occurred'
      logger.error(context, errorMessage, { 
        endpoint,
        status: response.status,
        body 
      })
      throw new Error(errorMessage)
    }

    // Check if the response data contains an error field even with 200 OK
    if (data.error) {
      const errorMessage = data.error
      logger.error(context, errorMessage, { 
        endpoint,
        status: response.status,
        body 
      })
      throw new Error(errorMessage)
    }

    logger.success(context, `Success from ${endpoint}`, { data })
    return data

  } catch (error) {
    if (error.message.includes('fetch')) {
      logger.error(context, 'Network error - cannot reach server', { 
        endpoint,
        error: error.message 
      })
      throw new Error('Network error - cannot reach server')
    }
    throw error
  }
}

/**
 * Upload file to presigned URL (external to our API)
 */
async function uploadToPresignedURL(url, file, context = 'File Upload') {
  // Determine content type: use file.type if available, otherwise infer from extension
  const contentType = file.type || getContentType(file.name)
  
  logger.info(context, 'Uploading file to cloud storage', { 
    filename: file.name,
    size: file.size,
    originalType: file.type,
    determinedType: contentType
  })

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: file
    })

    if (!response.ok) {
      logger.error(context, 'Upload to cloud storage failed', { 
        status: response.status,
        filename: file.name,
        contentType 
      })
      throw new Error(`Upload failed with status ${response.status}`)
    }

    logger.success(context, 'File uploaded to cloud storage', { 
      filename: file.name,
      contentType 
    })
    return true

  } catch (error) {
    logger.error(context, 'File upload error', { 
      error: error.message,
      filename: file.name 
    })
    throw new Error('Failed to upload file to cloud storage')
  }
}

/**
 * Authentication API
 */
export const authAPI = {
  async register(username, password) {
    return apiCall(
      '/UserAuthentication/register',
      { username, password },
      'User Registration'
    )
  },

  async login(username, password) {
    return apiCall(
      '/login',
      { username, password },
      'User Login'
    )
  },

  async logout(session) {
    return apiCall(
      '/logout',
      { session },
      'User Logout'
    )
  }
}

/**
 * File Management API
 */
export const fileAPI = {
  async listMyFiles(session) {
    return apiCall(
      '/my-files',
      { session },
      'List My Files'
    )
  },

  async listSharedWithMe(session) {
    return apiCall(
      '/my-shares',
      { session },
      'List Files Shared With Me'
    )
  },

  async requestUploadURL(session, filename) {
    return apiCall(
      '/FileUploading/requestUploadURL',
      { session, filename },
      'Request Upload URL'
    )
  },

  async uploadFile(session, file) {
    const context = 'Complete File Upload'
    
    try {
      // Step 1: Request upload URL
      const { file: fileId, uploadURL } = await this.requestUploadURL(session, file.name)
      
      // Step 2: Upload to cloud storage
      await uploadToPresignedURL(uploadURL, file, context)
      
      // Step 3: Confirm upload
      await this.confirmUpload(session, fileId)
      
      logger.success(context, 'File upload completed successfully', { 
        filename: file.name,
        fileId 
      })
      
      return { fileId, filename: file.name }
      
    } catch (error) {
      logger.error(context, 'File upload process failed', { 
        error: error.message,
        filename: file.name 
      })
      throw error
    }
  },

  async confirmUpload(session, fileId) {
    return apiCall(
      '/FileUploading/confirmUpload',
      { session, file: fileId },
      'Confirm Upload'
    )
  },

  async getDownloadURL(session, fileId) {
    return apiCall(
      '/download',
      { session, file: fileId },
      'Get Download URL'
    )
  },

  async downloadFile(session, fileId, filename) {
    const context = 'Download File'
    
    try {
      const { downloadURL } = await this.getDownloadURL(session, fileId)
      
      logger.info(context, 'Initiating file download', { filename, fileId })
      
      // Trigger browser download
      const link = document.createElement('a')
      link.href = downloadURL
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      logger.success(context, 'File download initiated', { filename })
      
    } catch (error) {
      logger.error(context, 'File download failed', { 
        error: error.message,
        filename,
        fileId 
      })
      throw error
    }
  },

  async getPreviewURL(session, fileId) {
    const context = 'Get Preview URL'
    
    try {
      const { downloadURL } = await this.getDownloadURL(session, fileId)
      logger.info(context, 'Got preview URL', { fileId })
      return downloadURL
    } catch (error) {
      logger.error(context, 'Failed to get preview URL', { 
        error: error.message,
        fileId 
      })
      throw error
    }
  }
}

/**
 * Sharing API
 */
export const sharingAPI = {
  async shareFile(session, fileId, shareWithUsername) {
    return apiCall(
      '/share',
      { session, file: fileId, shareWithUsername },
      'Share File'
    )
  },

  async revokeAccess(session, fileId, revokeForUsername) {
    return apiCall(
      '/revoke',
      { session, file: fileId, revokeForUsername },
      'Revoke Access'
    )
  }
}

