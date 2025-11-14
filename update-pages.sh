#!/bin/bash

# Script to update all pages with dynamic user data support
# This adds the necessary scripts and updates navigation links

PAGES_DIR="frontend/pages"
PAGES=(
    "career.html"
    "lifestyle.html"
    "family.html"
    "health.html"
    "finance.html"
    "spiritual.html"
    "remedies.html"
    "vastu.html"
    "past-karma.html"
    "medical-astrology.html"
    "pilgrimage.html"
    "daily-tracker.html"
    "ai-assistant.html"
    "business.html"
)

echo "🔄 Updating pages to be dynamic..."

for page in "${PAGES[@]}"; do
    if [ -f "$PAGES_DIR/$page" ]; then
        echo "  ✅ Processing $page..."
        
        # Add scripts if not present
        if ! grep -q "../config.js" "$PAGES_DIR/$page"; then
            # Find the title line and add scripts after auth-guard
            sed -i '' '/auth-guard.js/a\
    <script src="../config.js"></script>\
    <script src="../js/userData.js"></script>\
    <script src="../js/pageInit.js"></script>
' "$PAGES_DIR/$page" 2>/dev/null || true
        fi
        
        # Update navigation links
        sed -i '' 's|href="../index.html"|href="../home.html"|g' "$PAGES_DIR/$page" 2>/dev/null || true
        sed -i '' 's|Yogesh Life Blueprint|<span data-user-name>Life</span> Blueprint|g' "$PAGES_DIR/$page" 2>/dev/null || true
        
        # Add initialization script if not present
        if ! grep -q "PageInit.init" "$PAGES_DIR/$page"; then
            # Add before closing body tag
            sed -i '' '/<\/body>/i\
    <script>\
        document.addEventListener("DOMContentLoaded", async function() {\
            await PageInit.init();\
            AOS.init({ duration: 1000, once: true });\
        });\
    </script>
' "$PAGES_DIR/$page" 2>/dev/null || true
        fi
    else
        echo "  ⚠️  $page not found"
    fi
done

echo "✅ Pages updated!"

