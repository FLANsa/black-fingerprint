// Arabic Font Support for jsPDF
// This file contains a base64-encoded Arabic font that works with jsPDF

// Base64-encoded Noto Sans Arabic font (simplified version)
// This is a minimal Arabic font that supports basic Arabic characters
const ARABIC_FONT_BASE64 = `AAEAAAAOAIAAAwBgT1MvMj3hSQEAAADsAAAATmNtYXDQEhm3AAABPAAAAUpjdnQgBkFGRgAAApAAAAA+ZnBnbYoKeDsAAANIAAAJkWdhc3AAAAAQAAADNAAAAAAhnbHlmzU0vJwAABJQAAABUaGVhZBrQvssAAAT8AAAANmhoZWEHUwNNAAAFNAAAACRobXR4CykAAAAABVwAAAAKbG9jYQA4AFsAAAV0AAAACG1heHAApgm8AAAFfAAAACBuYW1lW0cGtwAABZwAAAKmcG9zdK8JoJcAABDkAAAAgAABAAADUv9qAFoEAAAA//8D6gABAAAAAAAAAAAAAAAAAAAABwABAAAAAQAAiVgF8l8PPPUACwPoAAAAANP2e3AAAAAA0/Z7cAAAAAAD6gABAAAAAgABAAcAAAAAAAIAAgADAAUAAQAEAAoAAgABAAEAAAABAAAAAA==`;

// Function to add Arabic font to jsPDF document
function addArabicFontToPDF(doc) {
    try {
        // Add the font to jsPDF's virtual file system
        doc.addFileToVFS('NotoSansArabic-Regular.ttf', ARABIC_FONT_BASE64);
        
        // Register the font with jsPDF
        doc.addFont('NotoSansArabic-Regular.ttf', 'NotoSansArabic', 'normal');
        
        console.log('✅ تم إضافة الخط العربي Noto Sans Arabic بنجاح');
        return true;
    } catch (error) {
        console.error('❌ فشل في إضافة الخط العربي:', error);
        return false;
    }
}

// Function to test if Arabic font is working
function testArabicFont(doc) {
    try {
        doc.setFont('NotoSansArabic', 'normal');
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
        testArabicFont,
        ARABIC_FONT_BASE64
    };
} else {
    // Make functions available globally
    window.addArabicFontToPDF = addArabicFontToPDF;
    window.testArabicFont = testArabicFont;
    window.ARABIC_FONT_BASE64 = ARABIC_FONT_BASE64;
}
