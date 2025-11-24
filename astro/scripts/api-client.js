/**
 * Unified API Client with Automatic Fallback
 * 
 * This client tries the external API first, and falls back to local backup if unavailable.
 * Drop-in replacement for direct fetch() calls.
 */

const EXTERNAL_API = 'https://ghibliapi.vercel.app';
const LOCAL_API = '/api'; // Served by server.js
const TIMEOUT_MS = 5000; // 5 second timeout

let useLocalAPI = false; // Flag to remember if external API is down

/**
 * Fetch with timeout
 */
function fetchWithTimeout(url, options = {}, timeout = TIMEOUT_MS) {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), timeout)
        )
    ]);
}

/**
 * Unified API fetch function
 * @param {string} endpoint - API endpoint (e.g., '/films', '/films/123')
 * @returns {Promise<any>} - JSON response
 */
async function apiFetch(endpoint) {
    // Ensure endpoint starts with /
    if (!endpoint.startsWith('/')) {
        endpoint = '/' + endpoint;
    }

    // If we already know external API is down, use local immediately
    if (useLocalAPI) {
        console.log(`📦 Using local API: ${LOCAL_API}${endpoint}`);
        return fetchLocalAPI(endpoint);
    }

    // Try external API first
    try {
        console.log(`🌐 Trying external API: ${EXTERNAL_API}${endpoint}`);
        const response = await fetchWithTimeout(`${EXTERNAL_API}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✓ External API successful`);
        return data;
        
    } catch (error) {
        console.warn(`⚠️ External API failed: ${error.message}`);
        console.log(`📦 Falling back to local API...`);
        
        // Mark external API as down for subsequent requests
        useLocalAPI = true;
        
        // Try local API as fallback
        return fetchLocalAPI(endpoint);
    }
}

/**
 * Fetch from local backup API
 */
async function fetchLocalAPI(endpoint) {
    try {
        const response = await fetch(`${LOCAL_API}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`Local API error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✓ Local API successful`);
        return data;
        
    } catch (error) {
        console.error(`❌ Local API also failed: ${error.message}`);
        throw new Error('Both external and local APIs are unavailable. Please check your connection and ensure backup data exists.');
    }
}

/**
 * Reset the API mode (useful for testing or manual override)
 */
function resetAPIMode() {
    useLocalAPI = false;
    console.log('🔄 API mode reset - will try external API again');
}

/**
 * Manually switch to local API mode
 */
function forceLocalAPI() {
    useLocalAPI = true;
    console.log('📦 Forced local API mode');
}

/**
 * Check current API mode
 */
function getAPIMode() {
    return useLocalAPI ? 'local' : 'external';
}

// Export for use in other files
// For browser use, these will be available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { apiFetch, resetAPIMode, forceLocalAPI, getAPIMode };
}
