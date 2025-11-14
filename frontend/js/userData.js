/**
 * User Data Service
 * Fetches and manages user-specific data from the API
 */

const UserDataService = {
    userProfile: null,
    blueprint: null,
    astrology: null,

    /**
     * Initialize and load user data
     */
    async init() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Fetch user blueprint data
            const response = await fetch(`${API_URL}/blueprint`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, redirect to login
                    localStorage.removeItem('token');
                    window.location.href = 'login.html';
                    return;
                }
                throw new Error('Failed to fetch user data');
            }

            const data = await response.json();
            
            this.userProfile = data.blueprint.userInfo;
            this.blueprint = data.blueprint;
            this.astrology = data.blueprint.astrology;

            return {
                userProfile: this.userProfile,
                blueprint: this.blueprint,
                astrology: this.astrology
            };
        } catch (error) {
            console.error('Error loading user data:', error);
            throw error;
        }
    },

    /**
     * Get user's name
     */
    getName() {
        return this.userProfile?.name || 'User';
    },

    /**
     * Get user's email
     */
    getEmail() {
        return this.userProfile?.email || '';
    },

    /**
     * Get user's date of birth
     */
    getDOB() {
        return this.userProfile?.dob || '';
    },

    /**
     * Get Life Path Number
     */
    getLifePath() {
        return this.astrology?.lifePath || 3;
    },

    /**
     * Get Birth Number
     */
    getBirthNumber() {
        return this.astrology?.birthNumber || 3;
    },

    /**
     * Get Zodiac Sign
     */
    getZodiacSign() {
        return this.astrology?.zodiacSign || 'Pisces';
    },

    /**
     * Get Planetary Ruler
     */
    getPlanetaryRuler() {
        return this.astrology?.planetaryRuler || {
            planet: 'Jupiter',
            archetype: 'The Sovereign Magician',
            energy: 'Expansion, wisdom, calm authority, masterful expression'
        };
    },

    /**
     * Get Archetype
     */
    getArchetype() {
        return this.astrology?.archetype || 'The Sovereign Magician';
    },

    /**
     * Get Core Vibration
     */
    getCoreVibration() {
        return this.astrology?.coreVibration || 'Calm, Classy, Grounded, Minimalist, Authentic';
    },

    /**
     * Get Mahadasha
     */
    getMahadasha() {
        return this.astrology?.mahadasha || 'Mercury';
    },

    /**
     * Get Ascendant
     */
    getAscendant() {
        return this.astrology?.ascendant || 'Virgo';
    },

    /**
     * Get complete astrology profile
     */
    getAstrologyProfile() {
        return this.astrology || {};
    },

    /**
     * Check if data is loaded
     */
    isLoaded() {
        return this.userProfile !== null && this.astrology !== null;
    },

    /**
     * Reload user data
     */
    async reload() {
        this.userProfile = null;
        this.blueprint = null;
        this.astrology = null;
        return await this.init();
    }
};

// Auto-initialize when script loads (if token exists)
if (typeof API_URL !== 'undefined') {
    // Don't auto-init, let pages call it explicitly
}

