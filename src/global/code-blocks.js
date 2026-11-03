import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/github-dark.css';

// Only the languages likely in posts, to keep the bundle small.
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('python', python);
hljs.registerLanguage('sql', sql);

// Medium's <pre> blocks use <br> for line breaks, often with a trailing space.
const codeText = pre => {
    const temp = document.createElement('div');
    temp.innerHTML = pre.innerHTML.replace(/<br\s*\/?>/g, '\n');
    return temp.textContent.split('\n').map(line => line.replace(/\s+$/, '')).join('\n').replace(/^\n+|\n+$/g, '');
};

// Fallback for browsers that block the Clipboard API.
const copyWithTextarea = text => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied ? Promise.resolve() : Promise.reject(new Error('copy failed'));
};

const copyText = text => (
    navigator.clipboard
        ? navigator.clipboard.writeText(text).catch(() => copyWithTextarea(text))
        : copyWithTextarea(text)
);

const copyButton = text => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'code-block-copy';
    button.textContent = 'Copy';
    button.addEventListener('click', () => {
        copyText(text).then(() => {
            button.textContent = 'Copied';
            setTimeout(() => { button.textContent = 'Copy'; }, 1500);
        }).catch(() => {});
    });
    return button;
};

// Turn each plain <pre> in a post into a highlighted code block with a
// window-style header and a copy button.
export const enhanceCodeBlocks = container => {
    if (!container) {
        return;
    }
    container.querySelectorAll('pre:not(.code-block-pre)').forEach(pre => {
        const text = codeText(pre);

        const code = document.createElement('code');
        code.className = 'hljs';
        code.innerHTML = hljs.highlightAuto(text).value;
        pre.innerHTML = '';
        pre.className = 'code-block-pre';
        pre.appendChild(code);

        const header = document.createElement('div');
        header.className = 'code-block-header';
        header.innerHTML = '<span class="code-block-dots"><i></i><i></i><i></i></span>';
        header.appendChild(copyButton(text));

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block';
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);
    });
};
