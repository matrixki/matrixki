// Fetch the Medium RSS feed and save it as public/posts.json.
// Medium's feed only returns the latest 10 stories, so posts already saved in
// posts.json are kept and merged with the new ones to build up an archive.
// Runs automatically before `npm start` and `npm run build`.

const fs = require('fs');
const { POSTS_FILE, decodeEntities, slugFromLink, cleanContent, makeExcerpt, readSavedPosts, savePosts } = require('./medium-utils');

const FEED_URL = 'https://medium.com/feed/@matrixki';

const readTag = (xml, tag) => {
    const match = xml.match(new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)</' + tag + '>'));
    return match ? stripCdata(match[1]) : '';
};

const readAllTags = (xml, tag) => {
    const matches = xml.match(new RegExp('<' + tag + '[^>]*>[\\s\\S]*?</' + tag + '>', 'g')) || [];
    return matches.map(m => stripCdata(m.replace(/^<[^>]+>|<\/[^>]+>$/g, '')));
};

const stripCdata = text => text.replace(/^\s*<!\[CDATA\[/, '').replace(/\]\]>\s*$/, '').trim();

const parseItem = itemXml => {
    const link = readTag(itemXml, 'link');
    const cleaned = cleanContent(readTag(itemXml, 'content:encoded'));

    return {
        id: readTag(itemXml, 'guid').split('/').pop(),
        slug: slugFromLink(link),
        aliases: cleaned.aliases,
        title: decodeEntities(readTag(itemXml, 'title')),
        date: new Date(readTag(itemXml, 'pubDate')).toISOString(),
        link: link.split('?')[0],
        tags: readAllTags(itemXml, 'category'),
        image: cleaned.image,
        excerpt: makeExcerpt(cleaned.content),
        content: cleaned.content,
    };
};

const main = async () => {
    let xml;
    try {
        const res = await fetch(FEED_URL);
        if (!res.ok) {
            throw new Error('HTTP ' + res.status);
        }
        xml = await res.text();
    } catch (e) {
        // Don't fail the build when Medium is unreachable; use the saved posts.
        console.warn('[fetch-medium] Could not fetch ' + FEED_URL + ' (' + e.message + '), keeping ' + readSavedPosts().length + ' saved posts.');
        if (!fs.existsSync(POSTS_FILE)) {
            fs.writeFileSync(POSTS_FILE, '[]\n');
        }
        return;
    }

    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const freshPosts = items.map(parseItem);
    const posts = savePosts(freshPosts);
    console.log('[fetch-medium] Saved ' + posts.length + ' posts (' + freshPosts.length + ' from feed) to public/posts.json');
};

main();
