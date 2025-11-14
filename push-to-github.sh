#!/bin/bash
echo "🚀 Life Info Tracker - GitHub Push Script"
echo ""
echo "Step 1: Create GitHub repository first!"
echo "   Go to: https://github.com/new"
echo "   Name: life-info-tracker"
echo "   Don't initialize with README"
echo ""
read -p "Press Enter after you've created the GitHub repo..."

echo ""
echo "Step 2: Pushing code to GitHub..."
git remote add origin https://github.com/yogesh0333/life-info-tracker.git 2>/dev/null || git remote set-url origin https://github.com/yogesh0333/life-info-tracker.git
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Code pushed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy backend to Railway"
    echo "2. Deploy frontend to Netlify"
    echo "3. Update frontend/config.js with backend URL"
else
    echo ""
    echo "❌ Push failed. Make sure:"
    echo "   - GitHub repo exists"
    echo "   - You have push access"
    echo "   - Internet connection is working"
fi
