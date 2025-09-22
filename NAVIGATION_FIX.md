# Dynamic Navigation Fix

## What I've Done

1. **Created `js/navigation.js`** - Centralized navigation system that:
   - Detects user role from localStorage
   - Generates appropriate navigation based on role:
     - **Regular Users**: الرئيسية + تسجيل الخروج
     - **Admin Users**: الرئيسية + إدارة المخزون + إدارة المبيعات + إدارة الهواتف + تسجيل الخروج
     - **Guests**: تسجيل الدخول only
   - Shows admin features only for admin users
   - Shows simplified navigation for regular users
   - Shows login link for guests

2. **Updated 2 pages as examples**:
   - `add_new_phone.html` - Now uses dynamic navigation
   - `add_accessory.html` - Now uses dynamic navigation

## How to Apply to Other Pages

### Method 1: Manual (Recommended)
For each page you want to fix:

1. **Replace the hardcoded navigation** in the HTML:
   ```html
   <div class="collapse navbar-collapse" id="navbarNav">
     <ul class="navbar-nav me-auto">
       <!-- Navigation will be populated by navigation.js -->
     </ul>
   </div>
   ```

2. **Add the navigation script** before closing `</body>`:
   ```html
   <!-- Navigation Script -->
   <script src="js/navigation.js"></script>
   <script>
     document.addEventListener('DOMContentLoaded', function() {
       initNavigation('page_name'); // Replace with actual page name
     });
   </script>
   ```

### Method 2: Using Helper Script
1. Include the helper script: `<script src="js/nav-helper.js"></script>`
2. Call: `applyDynamicNavigation('page_name');`

## Page Names for Active State
Use these identifiers for the `initNavigation()` function:
- `dashboard` - for dashboard.html
- `add_new_phone` - for add_new_phone.html
- `add_accessory` - for add_accessory.html
- `inventory_summary` - for inventory_summary.html
- `search` - for search.html
- `list_sales` - for list_sales.html
- `create_sale` - for create_sale.html
- `add_used_phone` - for add_used_phone.html
- `list_accessories` - for list_accessories_simple.html

## Benefits
- ✅ No more hardcoded navigation
- ✅ Centralized navigation management
- ✅ Role-based navigation (admin vs user)
- ✅ Easy to maintain and update
- ✅ Consistent across all pages
- ✅ Active page highlighting

## Testing
1. Login as admin - should see full navigation
2. Login as user - should see simplified navigation
3. Logout - should see only login link
4. Check that active page is highlighted correctly
