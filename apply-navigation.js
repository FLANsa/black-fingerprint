/**
 * Batch Navigation Application Script
 * Apply dynamic navigation to all HTML pages
 */

const fs = require('fs');
const path = require('path');

// Page mappings for active state
const pageMappings = {
    'dashboard.html': 'dashboard',
    'limited_dashboard.html': 'dashboard',
    'add_new_phone.html': 'add_new_phone',
    'add_used_phone.html': 'add_used_phone',
    'add_accessory.html': 'add_accessory',
    'inventory_summary.html': 'inventory_summary',
    'search.html': 'search',
    'list_sales.html': 'list_sales',
    'create_sale.html': 'create_sale',
    'list_accessories_simple.html': 'list_accessories',
    'edit_phone.html': 'add_new_phone',
    'edit_accessory.html': 'add_accessory',
    'view_sale.html': 'list_sales',
    'print_barcode.html': 'inventory_summary',
    'scan_barcode.html': 'inventory_summary',
    'list_accessories.html': 'list_accessories'
};

// Navigation replacement pattern
const navigationReplacement = `      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Navigation will be populated by navigation.js -->
        </ul>
      </div>`;

// Script to add
const scriptToAdd = `
  <!-- Navigation Script -->
  <script src="js/navigation.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      initNavigation('PAGE_NAME_PLACEHOLDER');
    });
  </script>`;

function applyNavigationToFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Skip if already has dynamic navigation
        if (content.includes('Navigation will be populated by navigation.js')) {
            console.log(`✅ ${filePath} - Already has dynamic navigation`);
            return;
        }
        
        // Skip login and index pages
        if (filePath.includes('login.html') || filePath.includes('index.html')) {
            console.log(`⏭️  ${filePath} - Skipped (public page)`);
            return;
        }
        
        // Replace hardcoded navigation
        const navPattern = /<div class="collapse navbar-collapse" id="navbarNav">[\s\S]*?<\/div>/g;
        content = content.replace(navPattern, navigationReplacement);
        
        // Add navigation script before closing body tag
        const bodyClosePattern = /<\/body>/;
        const pageName = pageMappings[path.basename(filePath)] || 'dashboard';
        const script = scriptToAdd.replace('PAGE_NAME_PLACEHOLDER', pageName);
        
        content = content.replace(bodyClosePattern, script + '\n</body>');
        
        // Write back to file
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${filePath} - Applied dynamic navigation`);
        
    } catch (error) {
        console.error(`❌ ${filePath} - Error:`, error.message);
    }
}

// Get all HTML files
const htmlFiles = fs.readdirSync('.')
    .filter(file => file.endsWith('.html'))
    .map(file => path.resolve(file));

console.log('🚀 Applying dynamic navigation to all HTML files...\n');

htmlFiles.forEach(applyNavigationToFile);

console.log('\n✨ Done! All pages now use dynamic navigation.');
console.log('\n📋 Navigation by user role:');
console.log('   👤 Regular Users: الرئيسية + تسجيل الخروج');
console.log('   👑 Admin Users: الرئيسية + إدارة المخزون + إدارة المبيعات + إدارة الهواتف + تسجيل الخروج');
console.log('   🚪 Guests: تسجيل الدخول only');
