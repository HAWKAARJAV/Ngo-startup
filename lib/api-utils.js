/**
 * API response helpers for standardized responses
 * SAFE: Additive utility, no behavior changes
 */

import { NextResponse } from 'next/server';

/**
 * Create success response
 * @param {Object} data - Response data
 * @param {number} status - HTTP status (default 200)
 */
export function successResponse(data, status = 200) {
    return NextResponse.json(data, { status });
}

/**
 * Create error response with proper logging
 * @param {string} message - Error message for client
 * @param {number} status - HTTP status code
 * @param {Error|string} error - Original error for logging
 * @param {string} context - Context for logging
 */
export function errorResponse(message, status = 500, error = null, context = 'API') {
    // Log error with context (but don't expose to client)
    if (error) {
        console.error(`[${context}] ${message}:`, error instanceof Error ? error.message : error);
    }
    
    const response = { error: message };
    
    // Include stack trace in development only
    if (process.env.NODE_ENV !== 'production' && error instanceof Error) {
        response.debug = {
            message: error.message,
            stack: error.stack?.split('\n').slice(0, 5)
        };
    }
    
    return NextResponse.json(response, { status });
}

/**
 * Validate required fields in request body
 * @param {Object} body - Request body
 * @param {string[]} requiredFields - Array of required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
export function validateRequiredFields(body, requiredFields) {
    const missing = requiredFields.filter(field => {
        const value = body[field];
        return value === undefined || value === null || value === '';
    });
    
    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Wrap async route handler with error boundary
 * @param {Function} handler - Async route handler
 * @param {string} context - Context for error logging
 */
export function withErrorBoundary(handler, context = 'API') {
    return async (request, params) => {
        try {
            return await handler(request, params);
        } catch (error) {
            // Handle Prisma-specific errors
            if (error.code === 'P2025') {
                return errorResponse('Record not found', 404, error, context);
            }
            if (error.code === 'P2002') {
                return errorResponse('Duplicate entry', 409, error, context);
            }
            if (error.code === 'P2003') {
                return errorResponse('Related record not found', 400, error, context);
            }
            
            // Generic error
            return errorResponse('Internal server error', 500, error, context);
        }
    };
}

/**
 * Standard HTTP status codes
 */
export const HttpStatus = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    RATE_LIMITED: 429,
    SERVER_ERROR: 500
};
