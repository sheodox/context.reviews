export function copyToClipboard(text) {
    const el = document.createElement('textarea');
    document.body.appendChild(el);
    el.textContent = text;
    el.select();
    document.execCommand('copy');
    el.remove();
}