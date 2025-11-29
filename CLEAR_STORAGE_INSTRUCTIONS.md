# How to See Your New Recipes

## The Problem
Your old recipes (6) are cached in localStorage. The app only loads sample recipes when localStorage is empty.

## Solution: Clear localStorage

### Option 1: Browser Developer Tools (Recommended)
1. Open your website in the browser
2. Press `F12` or `Right-click → Inspect` to open Developer Tools
3. Go to the **Console** tab
4. Type this command and press Enter:
   ```javascript
   localStorage.clear()
   ```
5. Refresh the page (`F5` or `Ctrl+R`)
6. You should now see all 24 recipes!

### Option 2: Application Tab
1. Open Developer Tools (`F12`)
2. Click the **Application** tab (or **Storage** in Firefox)
3. In the left sidebar, expand **Local Storage**
4. Click on your website URL
5. Right-click and select **Clear**
6. Refresh the page

### Option 3: Add a Reset Button (I can do this for you!)
I can add a "Reset to Sample Data" button in your app that does this automatically.

---

## Verify It Worked

After clearing and refreshing, you should see:
- **24 total recipes** (instead of 6)
- New categories: Lunch, Dinner, Snack, Appetizer, Occasion
- Recipes like: Avocado Toast, Margherita Pizza, BBQ Ribs, etc.

---

## For Future Updates

Whenever you update `sampleRecipes.js`, you'll need to clear localStorage to see the changes.

OR I can create a developer mode that forces a reload!
