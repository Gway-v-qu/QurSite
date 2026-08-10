const fs = require('fs');
const path = require('path');

const filesConfig = [
    { file: 'الحصري.html', apiPath: 'https://server13.mp3quran.net/husr/' },
    { file: 'المنشاوي.html', apiPath: 'https://server10.mp3quran.net/minsh/' },
    { file: 'خالد الجليل.html', apiPath: 'https://server10.mp3quran.net/jleel/' },
    { file: 'سعد الغامدي.html', apiPath: 'https://server7.mp3quran.net/s_gmd/' },
    { file: 'عبد الباسط عبد الصمد.html', apiPath: 'https://server7.mp3quran.net/basit/' },
    { file: 'ماهر المعيقلي.html', apiPath: 'https://server12.mp3quran.net/maher/' },
    { file: 'مشاري.html', apiPath: 'https://server8.mp3quran.net/afs/' }
];

const minshawiContent = fs.readFileSync(path.join(__dirname, 'المنشاوي.html'), 'utf8');
const scriptMatch = minshawiContent.match(/<script>\s*const BASE_PATH = "([^"]+)";([\s\S]*?)renderSurahs\(\);\s*<\/script>/);

if (!scriptMatch) {
    console.error("Could not find script block in المنشاوي.html");
    process.exit(1);
}

const originalJsBody = scriptMatch[2];

let modifiedJsBody = originalJsBody.replace(
    /function getAudioUrl\(surahNumber, surahName\) \{[\s\S]*?return BASE_PATH \+ paddedNumber \+ '\.mp3';\s*\}/,
    `function getAudioUrl(surahNumber, surahName) {
            const paddedNumber = surahNumber.toString().padStart(3, '0');
            return API_BASE_PATH + paddedNumber + '.mp3';
        }`
);

modifiedJsBody = modifiedJsBody.replace(
    /function getAudioUrl\(surahNumber, surahName\) \{[\s\S]*?return BASE_PATH \+ paddedNumber \+ '- ' \+ surahName \+ '\.mp3';\s*\}/,
    `function getAudioUrl(surahNumber, surahName) {
            const paddedNumber = surahNumber.toString().padStart(3, '0');
            return API_BASE_PATH + paddedNumber + '.mp3';
        }`
);

modifiedJsBody = modifiedJsBody.replace(
    /function downloadSurah\(number, name\) \{[\s\S]*?document\.body\.removeChild\(link\);\s*\}/,
    `function downloadSurah(number, name) {
            const audioUrl = getAudioUrl(number, name);
            const link = document.createElement('a');
            link.href = audioUrl;
            link.target = '_blank';
            link.download = number.toString().padStart(3, '0') + ' - ' + name + '.mp3';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }`
);

modifiedJsBody = modifiedJsBody.replace(
    /alert\('لا يمكن تشغيل السورة[^\)]+\);/,
    `alert('حدث خطأ أثناء تشغيل السورة من الخادم. يرجى المحاولة لاحقاً.');`
);

for (const config of filesConfig) {
    const filePath = path.join(__dirname, config.file);
    let content = fs.readFileSync(filePath, 'utf8');

    let basePathMatch = content.match(/const BASE_PATH = "([^"]+)";/);
    if (!basePathMatch) {
        if (config.file === 'الحصري.html') {
            basePathMatch = [null, "القرآن الكريم مسموع/محمود خليل الحصري/"];
        } else {
            console.error(`Could not find BASE_PATH in ${config.file}`);
            continue;
        }
    }
    const currentBasePath = basePathMatch[1];

    const newScriptBlock = `<script>
        const BASE_PATH = "${currentBasePath}";
        const API_BASE_PATH = "${config.apiPath}";${modifiedJsBody}renderSurahs();
    </script>`;

    if (config.file === 'الحصري.html') {
        content = content.replace(
            /<audio id="audioPlayer"[^>]*><\/audio>[\s\S]*?<script>\s*if \('serviceWorker' in navigator\)/,
            `<audio id="audioPlayer" style="display: none;"></audio>\n\n    ` + newScriptBlock + `\n\n<script>\n    if ('serviceWorker' in navigator)`
        );
    } else {
        content = content.replace(/<script>\s*const BASE_PATH = "[^"]+";[\s\S]*?renderSurahs\(\);\s*<\/script>/, newScriptBlock);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully updated ${config.file}`);
}
