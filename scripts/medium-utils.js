// Helpers shared by fetch-medium.js (RSS feed) and import-medium-export.js
// (Medium's "Download your information" export), so posts from both sources
// end up in posts.json in the same shape.

const fs = require('fs');
const path = require('path');

const POSTS_FILE = path.join(__dirname, '..', 'public', 'posts.json');

const decodeEntities = text => text
    .replace(/&#(\d+);/g, (m, code) => String.fromCharCode(code))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const stripHtml = html => decodeEntities(html.replace(/<[^>]+>/g, '')).trim();

// https://medium.com/@matrixki/some-title-8fccc7530249?source=rss -> some-title-8fccc7530249
const slugFromLink = link => {
    const lastSegment = link.split('?')[0].split('/').pop();
    try {
        return decodeURIComponent(lastSegment);
    } catch (e) {
        return lastSegment;
    }
};

// Clean up a story's HTML and pull out the featured image and the old
// WordPress slugs (from the "Originally published at" note) as aliases.
const cleanContent = (content, featuredImage) => {
    // Medium appends a 1x1 tracking image to every story.
    content = content.replace(/<img[^>]*src="https:\/\/medium\.com\/_\/stat[^>]*>/g, '');

    // "Originally published at matrixki.com/blog/<slug>" points at the old
    // WordPress URLs. Keep the slugs so those links still open the post.
    const aliases = [];
    content = content.replace(/<p[^>]*>\s*<em[^>]*>Originally published at\s*<\/em>[\s\S]*?<\/p>/g, note => {
        const href = note.match(/href="([^"]+)"/);
        if (href && /matrixki\.com/.test(href[1])) {
            const slug = href[1].split('?')[0].replace(/\/+$/, '').split('/').pop();
            if (slug) {
                aliases.push(slug);
            }
        }
        return '';
    });

    // The featured image (or the first image) is shown above the post. If the
    // story starts with it, drop that figure so it isn't shown twice.
    let image = featuredImage;
    if (!image) {
        const imageMatch = content.match(/<img[^>]*src="([^"]+)"/);
        image = imageMatch ? imageMatch[1] : '';
    }
    if (image) {
        content = content.replace(/^\s*<figure[^>]*>\s*<img[^>]*>[\s\S]*?<\/figure>/, '');
    }

    return { content: content.trim(), image: image, aliases: aliases };
};

const makeExcerpt = (content, summary) => {
    let excerpt = summary ? stripHtml(summary) : '';
    if (!excerpt) {
        const firstParagraph = content.match(/<p[^>]*>([\s\S]*?)<\/p>/);
        excerpt = firstParagraph ? stripHtml(firstParagraph[1]) : '';
    }
    excerpt = excerpt.replace(/…$/, '');
    if (excerpt.length > 120) {
        excerpt = excerpt.slice(0, 120) + '…';
    }
    return excerpt;
};

const readSavedPosts = () => {
    try {
        return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
};

// Merge posts into posts.json by id. With overwrite=false, posts already
// saved are left as they are and only new ones are added.
const savePosts = (newPosts, overwrite = true) => {
    const postsById = {};
    readSavedPosts().forEach(post => { postsById[post.id] = post; });
    newPosts.forEach(post => {
        if (overwrite || !postsById[post.id]) {
            postsById[post.id] = post;
        }
    });

    const posts = Object.values(postsById).sort((a, b) => b.date.localeCompare(a.date));
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2) + '\n');
    return posts;
};

module.exports = {
    POSTS_FILE,
    decodeEntities,
    stripHtml,
    slugFromLink,
    cleanContent,
    makeExcerpt,
    readSavedPosts,
    savePosts,
};
