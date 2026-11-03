// Runs after `react-scripts build`. Writes build/blog/<slug>/index.html for
// every post, a copy of build/index.html with that post's title, description
// and image in the <head>.
//
// Facebook, LINE, X, Slack etc. don't run JavaScript when they preview a
// link, so the tags React Helmet sets in the browser are invisible to them.
// Vercel serves these files before the SPA rewrite to /index.html, so
// crawlers get the post's tags and people still get the same React app.

const fs = require('fs');
const path = require('path');
const { POSTS_FILE } = require('./medium-utils');

const SITE_URL = 'https://matrixki.com';
const SITE_NAME = "Mike's personal blog";
const DEFAULT_IMAGE = SITE_URL + '/img/index_banner.png';
const BUILD_DIR = path.join(__dirname, '..', 'build');

const escapeHtml = text => String(text)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const headTags = post => {
    const url = SITE_URL + '/blog/' + encodeURIComponent(post.slug);
    const title = post.title + ' | ' + SITE_NAME;
    const tags = {
        'description': post.excerpt,
        'og:type': 'article',
        'og:site_name': SITE_NAME,
        'og:title': post.title,
        'og:description': post.excerpt,
        'og:url': url,
        'og:image': post.image || DEFAULT_IMAGE,
        'article:published_time': post.date,
        'twitter:card': 'summary_large_image',
        'twitter:title': post.title,
        'twitter:description': post.excerpt,
        'twitter:image': post.image || DEFAULT_IMAGE,
    };

    return '<title>' + escapeHtml(title) + '</title>'
        + Object.keys(tags).map(name => {
            // Open Graph tags use property=, the rest use name=.
            const attr = /^(og|article):/.test(name) ? 'property' : 'name';
            return '<meta ' + attr + '="' + name + '" content="' + escapeHtml(tags[name]) + '"/>';
        }).join('')
        + '<link rel="canonical" href="' + escapeHtml(post.link) + '"/>';
};

const main = () => {
    const template = fs.readFileSync(path.join(BUILD_DIR, 'index.html'), 'utf8');
    const posts = JSON.parse(fs.readFileSync(POSTS_FILE, 'utf8'));

    let pageCount = 0;
    posts.forEach(post => {
        // Old WordPress slugs get a page too, so old shared links still preview.
        [post.slug].concat(post.aliases || []).forEach(slug => {
            const html = template
                .replace(/<title>[\s\S]*?<\/title>/, '')
                .replace('</head>', headTags(post) + '</head>');
            const dir = path.join(BUILD_DIR, 'blog', slug);
            fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(path.join(dir, 'index.html'), html);
            pageCount++;
        });
    });

    console.log('[post-pages] Wrote ' + pageCount + ' pages for ' + posts.length + ' posts');
};

main();
