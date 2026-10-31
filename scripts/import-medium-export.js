// One-time import of older posts from Medium's "Download your information"
// export, since the RSS feed only has the latest 10 stories.
//
// Usage: npm run import-medium-export -- <path to unzipped export folder>
//
// Posts already in posts.json (from the feed) are left as they are; only
// posts missing from it are added.

const fs = require('fs');
const path = require('path');
const { decodeEntities, slugFromLink, cleanContent, makeExcerpt, savePosts } = require('./medium-utils');

const match = (html, regex) => {
    const result = html.match(regex);
    return result ? result[1] : '';
};

// The export wraps the story in Medium's editor markup
// (<section><div class="section-content"><div class="section-inner">...).
// Unwrap it to plain HTML like the feed has, keeping a <hr> between sections.
const unwrapBody = body => {
    let first = true;
    return body
        .replace(/<div class="section-divider">\s*<hr[^>]*>\s*<\/div>/g, () => {
            const divider = first ? '' : '<hr>';
            first = false;
            return divider;
        })
        .replace(/<\/?section[^>]*>/g, '')
        .replace(/<\/?div[^>]*>/g, '');
};

const parseExportFile = html => {
    const title = decodeEntities(match(html, /<h1 class="p-name">([\s\S]*?)<\/h1>/).trim());
    const link = match(html, /<a href="([^"]+)" class="p-canonical"/);
    const tags = (html.match(/<a href="https:\/\/medium\.com\/tag\/[^"]+" class="p-tag"/g) || [])
        .map(tag => decodeURIComponent(tag.match(/\/tag\/([^"]+)"/)[1]));

    let body = unwrapBody(match(html, /<section data-field="body"[^>]*>([\s\S]*)<\/section>\s*<footer>/));
    // The story repeats its title as the first heading (or paragraph).
    body = body.replace(/^\s*<h3[^>]*graf--title[^>]*>[\s\S]*?<\/h3>/, '');
    body = body.replace(/^\s*<p[^>]*>([\s\S]*?)<\/p>/, (paragraph, text) => (
        decodeEntities(text.replace(/<[^>]+>/g, '')).trim() === title ? '' : paragraph
    ));

    const featuredImage = match(body, /<img[^>]*data-is-featured="true"[^>]*src="([^"]+)"/);
    const cleaned = cleanContent(body, featuredImage);
    // Removing the "Originally published" note can leave its section divider behind.
    cleaned.content = cleaned.content.replace(/(\s*<hr>)+$/, '').replace(/^(<hr>\s*)+/, '');

    return {
        id: match(html, /href="https:\/\/medium\.com\/p\/(\w+)"/),
        slug: slugFromLink(link),
        aliases: cleaned.aliases,
        title: title,
        date: match(html, /<time class="dt-published" datetime="([^"]+)"/),
        link: link.split('?')[0],
        tags: tags,
        image: cleaned.image,
        excerpt: makeExcerpt(cleaned.content, match(html, /<section data-field="subtitle"[^>]*>([\s\S]*?)<\/section>/)),
        content: cleaned.content,
    };
};

const main = () => {
    const exportDir = process.argv[2];
    if (!exportDir) {
        console.error('Usage: npm run import-medium-export -- <path to unzipped export folder>');
        process.exit(1);
    }

    const postsDir = path.join(exportDir, 'posts');
    const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.html'));

    const posts = [];
    files.forEach(file => {
        const html = fs.readFileSync(path.join(postsDir, file), 'utf8');
        const post = parseExportFile(html);
        // Drafts have no publish date or canonical link.
        if (!post.id || !post.date || !post.link) {
            console.log('[import] Skipping unpublished story ' + file);
            return;
        }
        posts.push(post);
    });

    const saved = savePosts(posts, false);
    console.log('[import] Read ' + posts.length + ' published stories, posts.json now has ' + saved.length + ' posts');
};

main();
