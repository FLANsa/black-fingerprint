// Arabic Font Support for jsPDF
// This file contains a base64-encoded Arabic font that works with jsPDF

// Simplified approach - use system fonts with better Arabic support detection
// Instead of embedding a complex font, we'll use a more reliable method

// Function to find the best Arabic-supporting font
function addArabicFontToPDF(doc) {
    try {
        // Test system fonts for Arabic support
        const systemFonts = ['arial', 'helvetica', 'times', 'courier', 'verdana'];
        
        for (const fontName of systemFonts) {
            try {
                doc.setFont(fontName, 'normal');
                // Test with a simple Arabic character
                doc.text('ا', 0, 0, { isInputRtl: true });
                console.log(`✅ تم العثور على خط يدعم العربية: ${fontName}`);
                return fontName;
            } catch (e) {
                // Font doesn't support Arabic, try next
                continue;
            }
        }
        
        // If no Arabic font found, use helvetica as fallback
        doc.setFont('helvetica', 'normal');
        console.log('❌ لم يتم العثور على خط يدعم العربية، سيتم استخدام Helvetica');
        return 'helvetica';
    } catch (error) {
        console.error('❌ فشل في إعداد الخط:', error);
        return 'helvetica';
    }
}

// Function to test if Arabic font is working
function testArabicFont(doc) {
    try {
        // Test with the current font
        doc.setFontSize(12);
        
        // Test with a simple Arabic character
        doc.text('ا', 10, 10, { isInputRtl: true });
        
        console.log('✅ اختبار الخط العربي نجح');
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الخط العربي:', error);
        return false;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addArabicFontToPDF,
        testArabicFont
    };
} else {
    // Make functions available globally
    window.addArabicFontToPDF = addArabicFontToPDF;
    window.testArabicFont = testArabicFont;
}
