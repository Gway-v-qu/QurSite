const fs = require('fs');
const path = require('path');

const zipFixes = {
    'الحصري.html': 'محمود خليل الحصري.zip',
    'عبد الباسط عبد الصمد.html': 'عبد الباسط عبد الصمد.zip',
    'ماهر المعيقلي.html': 'ماهر المعيقلي.zip'
};

for (const [filename, correctZip] of Object.entries(zipFixes)) {
    const filePath = path.join(__dirname, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/const zipPath = BASE_PATH \+ "محمد صديق المنشاوي\.zip";/, 'const zipPath = BASE_PATH + "' + correctZip + '";');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed ZIP name in ' + filename);
}

const filesToUpdate = [
    { file: 'خالد الجليل.html', apiPath: 'https://server10.mp3quran.net/jleel/' },
    { file: 'سعد الغامدي.html', apiPath: 'https://server7.mp3quran.net/s_gmd/' },
    { file: 'مشاري.html', apiPath: 'https://server8.mp3quran.net/afs/' }
];

for (const config of filesToUpdate) {
    const filePath = path.join(__dirname, config.file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(/(const BASE_PATH = "[^"]+";)/, '$1\n        const API_BASE_PATH = "' + config.apiPath + '";');

    content = content.replace(
        /function getAudioUrl\(surahNumber, surahName\) \{[\s\S]*?return BASE_PATH \+ [^\}]+;\s*\}/,
        'function getAudioUrl(surahNumber, surahName) {\n            const paddedNumber = surahNumber.toString().padStart(3, \'0\');\n            return API_BASE_PATH + paddedNumber + \'.mp3\';\n        }'
    );

    content = content.replace(
        /function downloadSurah\(number, name\) \{[\s\S]*?document\.body\.removeChild\(link\);\s*\}/,
        'function downloadSurah(number, name) {\n            const audioUrl = getAudioUrl(number, name);\n            const link = document.createElement(\'a\');\n            link.href = audioUrl;\n            link.target = \'_blank\';\n            link.download = number.toString().padStart(3, \'0\') + \' - \' + name + \'.mp3\';\n            document.body.appendChild(link);\n            link.click();\n            document.body.removeChild(link);\n        }'
    );

    content = content.replace(
        /alert\('[^']+' \+ audioUrl\);/,
        'alert(\'حدث خطأ أثناء تشغيل السورة من الخادم. يرجى المحاولة لاحقاً.\');'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated audio URLs in ' + config.file);
}
