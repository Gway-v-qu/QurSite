const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    { file: 'خالد الجليل.html', apiPath: 'https://server10.mp3quran.net/jleel/' },
    { file: 'سعد الغامدي.html', apiPath: 'https://server7.mp3quran.net/s_gmd/' },
    { file: 'مشاري.html', apiPath: 'https://server8.mp3quran.net/afs/' }
];

for (const config of filesToUpdate) {
    const filePath = path.join(__dirname, config.file);
    let content = fs.readFileSync(filePath, 'utf8');

    content = content.replace(
        /function getAudioUrl\(surahNumber\) \{[\s\S]*?return BASE_PATH \+ [^\}]+;\s*\}/,
        'function getAudioUrl(surahNumber, surahName) {\n            const paddedNumber = surahNumber.toString().padStart(3, \'0\');\n            return API_BASE_PATH + paddedNumber + \'.mp3\';\n        }'
    );

    // Some files might still have getAudioUrl(number) in playSurah instead of getAudioUrl(number, name)
    content = content.replace(
        /const audioUrl = getAudioUrl\(number\);/,
        'const audioUrl = getAudioUrl(number, name);'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed getAudioUrl in ' + config.file);
}
