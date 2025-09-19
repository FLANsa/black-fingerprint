// Arabic Font Support for jsPDF
// This file provides proper Arabic font support for PDF generation

// Function to load Arabic font from Google Fonts
async function loadArabicFont(doc) {
    try {
        console.log('🔄 جاري تحميل الخط العربي من Google Fonts...');
        
        // Try to load Amiri font from Google Fonts
        const fontUrl = 'https://fonts.gstatic.com/s/amiri/v27/J7aRnpd8CGxBHqUpvrIw74NL.woff2';
        
        const response = await fetch(fontUrl);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
        
        // Add font to jsPDF
        doc.addFileToVFS('Amiri-Regular.woff2', base64);
        doc.addFont('Amiri-Regular.woff2', 'Amiri', 'normal');
        
        console.log('✅ تم تحميل الخط العربي Amiri بنجاح');
        return true;
    } catch (error) {
        console.warn('❌ فشل تحميل الخط العربي من Google Fonts:', error);
        return false;
    }
}

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

// Function to set up Arabic font for PDF
async function addArabicFontToPDF(doc) {
    try {
        // Try to load Arabic font first
        const arabicLoaded = await loadArabicFont(doc);
        
        if (arabicLoaded) {
            doc.setFont('Amiri', 'normal');
            console.log('✅ تم إعداد الخط العربي للـ PDF');
            return 'arabic-amiri';
        } else {
            // Fallback to system font
            doc.setFont('helvetica', 'normal');
            console.log('❌ فشل تحميل الخط العربي، سيتم استخدام Helvetica');
            return 'helvetica-fallback';
        }
    } catch (error) {
        console.error('❌ فشل في إعداد الخط:', error);
        doc.setFont('helvetica', 'normal');
        return 'helvetica-fallback';
    }
}

// Function to test if Arabic font is working
function testArabicFont(doc) {
    try {
        doc.setFontSize(12);
        // Test with Arabic text
        doc.text('اختبار', 10, 10, { isInputRtl: true });
        
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
        convertArabicToEnglish,
        loadArabicFont
    };
} else {
    // Make functions available globally
    window.addArabicFontToPDF = addArabicFontToPDF;
    window.testArabicFont = testArabicFont;
    window.convertArabicToEnglish = convertArabicToEnglish;
    window.loadArabicFont = loadArabicFont;
}
