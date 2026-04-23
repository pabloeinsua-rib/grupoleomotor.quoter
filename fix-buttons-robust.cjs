const fs = require('fs');
const glob = require('glob');

function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const fileList = fs.readdirSync(dir);
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        if (fs.statSync(name).isDirectory()) {
            getFiles(name, files);
        } else if (name.endsWith('.tsx') || name.endsWith('.ts')) {
            files.push(name);
        }
    }
    return files;
}

const files = [...getFiles('components'), ...getFiles('src'), 'App.tsx'].filter(f => fs.existsSync(f));

for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Find all <button ... > tags
    // We should parse it correctly. A good heuristic: split by "<button" and inside each block until ">" replace rounded
    let parts = content.split(/<button\b/);
    if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
            // Find the first ">" but wait, JSX might have => inside attributes
            // A better way: match className="..." inside <button
            // Let's just find `className="..."` or `className={...}` within the `<button` definition.
            // Actually, we can just replace 'rounded-*' across the entire file for ANY `className` that looks like it belongs to a button since the user asked to make ALL buttons rectangular.
        }
    }

    // Since the instruction is "donde encuentres botones con las esquinas redondeadas, modificalos a rectangulares con esquinas",
    // We can confidently remove `rounded-xl`, `rounded-full`, etc from className combinations if they are associated with buttons.
    // Let's do a more robust regex that ignores `=>` inside JSX.
    // Instead of `[^>]+`, we use `[\s\S]*?` up to `className=`
    
    // Replace in `<button ... className="..."`
    content = content.replace(/(<button[\s\S]*?className=(['"]))(.*?)\2/g, (match, prefix, quote, classStr) => {
        return prefix + classStr.replace(/\brounded(-[a-z0-9]+)?\b/g, 'rounded-none') + quote;
    });
    
    // Replace in `<button ... className={ \`...\` }`
    content = content.replace(/(<button[\s\S]*?className=\{`)(.*?)`\}/g, (match, prefix, classStr) => {
        return prefix + classStr.replace(/\brounded(-[a-z0-9]+)?\b/g, 'rounded-none') + "`}";
    });
    
    // Also, links acting as buttons (a classes with padding and bg color)
    content = content.replace(/(<a[\s\S]*?className=(['"]))(.*?)\2/g, (match, prefix, quote, classStr) => {
        if (classStr.includes('bg-') && classStr.includes('hover:')) {
           return prefix + classStr.replace(/\brounded(-[a-z0-9]+)?\b/g, 'rounded-none') + quote;
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed buttons properly in: ' + file);
    }
}
