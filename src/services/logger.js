/**
 * Logger service with toggleable logging
 * Logs API errors and important events
 */

class Logger {
  constructor() {
    // Check localStorage for logging preference, default to true
    this.enabled = localStorage.getItem('conceptbox_logging_enabled') !== 'false'
  }

  enable() {
    this.enabled = true
    localStorage.setItem('conceptbox_logging_enabled', 'true')
    console.log('📝 ConceptBox logging enabled')
  }

  disable() {
    this.enabled = false
    localStorage.setItem('conceptbox_logging_enabled', 'false')
    console.log('📝 ConceptBox logging disabled')
  }

  isEnabled() {
    return this.enabled
  }

  error(context, error, details = {}) {
    if (!this.enabled) return
    
    console.error('❌ API Error:', {
      context,
      error: error.message || error,
      timestamp: new Date().toISOString(),
      ...details
    })
  }

  warning(context, message, details = {}) {
    if (!this.enabled) return
    
    console.warn('⚠️ Warning:', {
      context,
      message,
      timestamp: new Date().toISOString(),
      ...details
    })
  }

  info(context, message, details = {}) {
    if (!this.enabled) return
    
    console.log('ℹ️ Info:', {
      context,
      message,
      timestamp: new Date().toISOString(),
      ...details
    })
  }

  success(context, message, details = {}) {
    if (!this.enabled) return
    
    console.log('✅ Success:', {
      context,
      message,
      timestamp: new Date().toISOString(),
      ...details
    })
  }
}

export const logger = new Logger()

