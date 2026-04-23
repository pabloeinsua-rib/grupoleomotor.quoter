const fs = require('fs');
const path = require('path');

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
    
    let modified = false;
    
    // Replace rounded on <button ... className="...">
    content = content.replace(/(<button[^>]+className=(['"]))(.*?)(\2)/gs, (match, p1, p2, classNames, p4) => {
        const newClassNames = classNames.replace(/\brounded(-[a-z0-9]+)?\b/g, 'rounded-none');
        if (newClassNames !== classNames) modified = true;
        return p1 + newClassNames + p4;
    });

    // Replace also on known custom button components: ActionButton, SelectionButton, GlassOptionButton, ToggleButton, ActionCard (links)
    // Actually simpler: just find `className="..."` string globally where `text-white` or `bg-` and `p-` and `rounded` are combined?
    // Let's also do a general replace for specific files where we know we have these components. Let's just apply to <button ...> for now, plus any `glass-btn`, `glass-btn-secondary`.
    
    content = content.replace(/\bglass-btn\b/g, 'glass-btn rounded-none');
    content = content.replace(/\bglass-btn-secondary\b/g, 'glass-btn-secondary rounded-none');

    // Remove overlapping if happened
    content = content.replace(/rounded-none rounded-none/g, 'rounded-none');

    if (modified || content !== fs.readFileSync(file, 'utf8')) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed rounded buttons in: ' + file);
    }
}
