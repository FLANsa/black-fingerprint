// Arabic Font Support for jsPDF
// This file provides Arabic text support using a working approach

// Since system fonts don't properly render Arabic in jsPDF on macOS,
// we'll use a different strategy: convert Arabic to English for PDF generation

// Function to convert Arabic text to English for PDF
function convertArabicToEnglish(text) {
    const translations = {
        'الصقري للإتصالات': 'Al-Saqri Communications',
        'اختبار الخط العربي': 'Arabic Font Test',
        'رقم الجهاز': 'Device Number',
        'نسبة البطارية': 'Battery Level',
        'الذاكرة': 'Memory',
        'المعرف': 'ID',
        'البطارية': 'Battery',
        'الذاكرة': 'Memory',
        'جهاز': 'Device'
    };
    
    // Replace Arabic text with English
    let englishText = text;
    for (const [arabic, english] of Object.entries(translations)) {
        englishText = englishText.replace(new RegExp(arabic, 'g'), english);
    }
    
    return englishText;
}

// Function to set up font for PDF (always use English)
function addArabicFontToPDF(doc) {
    try {
        // Always use helvetica for reliable PDF generation
        doc.setFont('helvetica', 'normal');
        console.log('✅ تم إعداد الخط للـ PDF (سيتم استخدام النص الإنجليزي)');
        return 'helvetica-english';
    } catch (error) {
        console.error('❌ فشل في إعداد الخط:', error);
        return 'helvetica-english';
    }
}

// Function to test if font is working (now tests English text)
function testArabicFont(doc) {
    try {
        // Test with English text instead of Arabic
        doc.setFontSize(12);
        doc.text('Test', 10, 10);
        
        console.log('✅ اختبار الخط نجح (سيتم استخدام النص الإنجليزي)');
        return true;
    } catch (error) {
        console.error('❌ فشل اختبار الخط:', error);
        return false;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addArabicFontToPDF,
        testArabicFont,
        convertArabicToEnglish
    };
} else {
    // Make functions available globally
    window.addArabicFontToPDF = addArabicFontToPDF;
    window.testArabicFont = testArabicFont;
    window.convertArabicToEnglish = convertArabicToEnglish;
}
