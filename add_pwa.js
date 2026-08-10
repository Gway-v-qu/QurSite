const fs = require('fs');
const path = require('path');

const rootDir = __dirname;

function getAllHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        if (file === 'node_modules' || file.startsWith('.')) return;
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllHtmlFiles(filePath));
        } else {
            if (filePath.endsWith('.html')) {
                results.push(filePath);
            }
        }
    });
    return results;
}

const htmlFiles = getAllHtmlFiles(rootDir);
let updatedCount = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let changed = false;

    // Calculate relative depth for manifest and sw paths
    const relativePath = path.relative(path.dirname(file), rootDir);
    const prefix = relativePath ? relativePath.replace(/\\/g, '/') + '/' : './';

    // 1. Inject manifest link before </head> if not exists
    if (!content.includes('rel="manifest"')) {
        const manifestTag = `\n    <link rel="manifest" href="${prefix}manifest.json">\n`;
        content = content.replace('</head>', manifestTag + '</head>');
        changed = true;
    }

    // 2. Inject Service Worker registration before </body> if not exists
    if (!content.includes('serviceWorker.register')) {
        const swScript = `
<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('${prefix}sw.js', { scope: '${prefix}' })
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
</script>
`;
        content = content.replace('</body>', swScript + '</body>');
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(file, content, 'utf8');
        updatedCount++;
    }
});

console.log(`PWA code injected into ${updatedCount} HTML files.`);
