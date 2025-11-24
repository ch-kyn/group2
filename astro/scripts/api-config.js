/**
 * API Configuration
 * This file is dynamically generated based on the environment
 * - Production/default: Uses external Ghibli API
 * - Local mode (npm run local): Uses local backup
 */

// This will be set by the server when in local mode
window.API_CONFIG = {
    mode: 'external', // or 'local'
    baseUrl: 'https://ghibliapi.vercel.app'
};
