/**
 * Security utilities for production hardening
 * SAFE: Additive only, no behavior changes
 */

import { cookies } from 'next/headers';

/**
 * Get current session from cookie (safe parsing with fallback)
 * @returns {Object|null} Session object or null
 */
export async function getSession() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        
        if (!token) return null;
        
        const session = JSON.parse(token);
        
        // Validate session structure
        if (!session.id || !session.email || !session.role) {
            console.warn('[Security] Invalid session structure detected');
            return null;
        }
        
        return session;
    } catch (error) {
        console.error('[Security] Session parse error:', error.message);
        return null;
    }
}

/**
 * Validate that current user has required role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Object} { authorized: boolean, session: Object|null, error: string|null }
 */
export async function validateRole(allowedRoles) {
    const session = await getSession();
    
    if (!session) {
        return { authorized: false, session: null, error: 'Authentication required' };
    }
    
    if (!allowedRoles.includes(session.role)) {
        return { authorized: false, session, error: 'Insufficient permissions' };
    }
    
    return { authorized: true, session, error: null };
}

/**
 * Sanitize string input (basic XSS prevention)
 * @param {string} input - User input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized string
 */
export function sanitizeString(input, maxLength = 1000) {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .slice(0, maxLength)
        .replace(/[<>]/g, ''); // Basic XSS prevention
}

/**
 * Validate UUID format
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid UUID
 */
export function isValidUUID(id) {
    if (typeof id !== 'string') return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export function isValidEmail(email) {
    if (typeof email !== 'string') return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate positive number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid positive number
 */
export function isPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
}

/**
 * Safe JSON parse with fallback
 * @param {string} str - JSON string
 * @param {any} fallback - Fallback value
 * @returns {any} Parsed value or fallback
 */
export function safeJsonParse(str, fallback = null) {
    try {
        return JSON.parse(str);
    } catch {
        return fallback;
    }
}

/**
 * Rate limiting helper (in-memory, basic)
 * TODO: Replace with Redis in production
 */
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100;

export function checkRateLimit(identifier) {
    const now = Date.now();
    const record = rateLimitMap.get(identifier);
    
    if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
        rateLimitMap.set(identifier, { count: 1, timestamp: now });
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }
    
    if (record.count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }
    
    record.count++;
    return { allowed: true, remaining: MAX_REQUESTS - record.count };
}

/**
 * Generate standardized error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {Object} details - Additional details (not exposed in production)
 */
export function errorResponse(message, status = 500, details = null) {
    const response = { error: message };
    
    // Only include details in development
    if (process.env.NODE_ENV !== 'production' && details) {
        response.details = details;
    }
    
    return { body: response, status };
}

/**
 * Allowed file types for uploads
 */
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
];

/**
 * Maximum file size (2MB)
 */
export const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @returns {{ valid: boolean, error: string|null }}
 */
export function validateFileUpload(file) {
    if (!file) {
        return { valid: false, error: 'No file provided' };
    }
    
    if (file.size > MAX_FILE_SIZE) {
        return { valid: false, error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` };
    }
    
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Allowed: PDF, JPEG, PNG, GIF, WebP' };
    }
    
    return { valid: true, error: null };
}
