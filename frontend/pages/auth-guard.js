// STRICT Authentication Guard - Include in all protected pages
// NO ACCESS without valid JWT token
(function() {
    'use strict';
    
    const currentPath = window.location.pathname;
    
    // Only allow login page without authentication
    if (currentPath.includes('login.html')) {
        return; // Login page is public
    }
    
    // Get token
    const token = localStorage.getItem('token');
    
    // NO TOKEN = NO ACCESS
    if (!token) {
        console.log('🔒 UNAUTHORIZED: No token found. Redirecting to login...');
        localStorage.clear(); // Clear any stale data
        window.location.replace('/pages/login.html');
        throw new Error('Unauthorized access attempt');
    }
    
    // Verify token validity
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000;
        const currentTime = Date.now();
        
        // Check expiration (with 5 minute buffer for network delays)
        if (currentTime >= (expirationTime - 5 * 60 * 1000)) {
            console.log('🔒 EXPIRED: Token expired. Redirecting to login...');
            // Only clear token, keep user data
            localStorage.removeItem('token');
            window.location.replace('/pages/login.html');
            throw new Error('Token expired');
        }
        
        // Token is valid - extend session by updating login time
        localStorage.setItem('loginTime', currentTime.toString());
        console.log('✅ Authentication verified for:', payload.id);
        console.log('⏰ Token expires in:', Math.round((expirationTime - currentTime) / 1000 / 60), 'minutes');
        
    } catch (error) {
        // Only clear token if it's invalid, not if it's expired
        if (error.message !== 'Token expired') {
            console.error('🔒 INVALID TOKEN: Redirecting to login...', error.message);
            localStorage.removeItem('token');
            window.location.replace('/pages/login.html');
            throw new Error('Invalid token');
        }
    }
})();

