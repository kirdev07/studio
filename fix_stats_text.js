const fs = require('fs');
let css = fs.readFileSync('static/style.css', 'utf8');

// Replace the buggy style that forces black text in light mode for stats
css = css.replace(
    /:root\[data-theme="light"\] \.stat-card h3 {\n    color: var\(--text-primary\) !important;\n}/g,
    ''
);

fs.writeFileSync('static/style.css', css);
console.log('Fixed stats text CSS');
