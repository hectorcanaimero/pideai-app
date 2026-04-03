#!/bin/bash
# Generate app icon and splash screen assets
# Requires: ImageMagick (brew install imagemagick)
#
# Usage: ./scripts/generate-assets.sh <source-icon-1024x1024.png>
#
# This script generates all required icon sizes from a single 1024x1024 source.
# For now, the default Expo icons are used as placeholders.

echo "================================================================="
echo "PideAI Admin — Asset Generation"
echo "================================================================="
echo ""
echo "To generate production assets:"
echo ""
echo "1. Create a 1024x1024 PNG icon (no transparency for iOS)"
echo "2. Create a 1284x2778 splash screen image"
echo "3. Place them in assets/images/"
echo "4. Update app.json to reference them"
echo ""
echo "Current placeholder assets are in assets/images/"
echo ""
echo "iOS Requirements:"
echo "  - App icon: 1024x1024 (no alpha channel)"
echo "  - Splash: 1284x2778"
echo ""
echo "Android Requirements:"
echo "  - Adaptive icon foreground: 1024x1024"
echo "  - Adaptive icon background: solid color (#1A1A2E)"
echo "  - Feature graphic: 1024x500"
echo ""
echo "Screenshots (both platforms):"
echo "  - iPhone 6.7\": 1290x2796"
echo "  - iPhone 5.5\": 1242x2208"
echo "  - Android phone: 1080x1920 (minimum)"
echo "================================================================="
