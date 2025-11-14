/**
 * Page Initialization Helper
 * Common functionality for all pages
 */

const PageInit = {
    /**
     * Initialize page with user data
     * Call this at the start of each page's DOMContentLoaded
     */
    async init() {
        try {
            // Load user data
            await UserDataService.init();
            
            // Replace common placeholders
            this.replaceCommonPlaceholders();
            
            return true;
        } catch (error) {
            console.error('Error initializing page:', error);
            if (error.message.includes('token') || error.message.includes('401')) {
                window.location.href = 'login.html';
            }
            return false;
        }
    },

    /**
     * Replace common placeholders in the page
     */
    replaceCommonPlaceholders() {
        // Replace user name
        document.querySelectorAll('[data-user-name]').forEach(el => {
            el.textContent = UserDataService.getName();
        });

        // Replace Life Path
        document.querySelectorAll('[data-life-path]').forEach(el => {
            el.textContent = UserDataService.getLifePath();
        });

        // Replace Archetype
        document.querySelectorAll('[data-archetype]').forEach(el => {
            el.textContent = UserDataService.getArchetype();
        });

        // Replace Planetary Ruler
        document.querySelectorAll('[data-planet]').forEach(el => {
            el.textContent = UserDataService.getPlanetaryRuler().planet;
        });

        // Replace Core Vibration
        document.querySelectorAll('[data-core-vibration]').forEach(el => {
            el.textContent = UserDataService.getCoreVibration();
        });

        // Replace Zodiac Sign
        document.querySelectorAll('[data-zodiac]').forEach(el => {
            el.textContent = UserDataService.getZodiacSign();
        });

        // Replace Mahadasha
        document.querySelectorAll('[data-mahadasha]').forEach(el => {
            el.textContent = UserDataService.getMahadasha();
        });
    },

    /**
     * Update page title with user name
     */
    updatePageTitle(baseTitle) {
        document.title = `${baseTitle} - ${UserDataService.getName()}'s Life Blueprint`;
    },

    /**
     * Get user's age (if DOB is available)
     */
    getAge() {
        const dob = UserDataService.getDOB();
        if (!dob) return null;
        
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    },

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
};

