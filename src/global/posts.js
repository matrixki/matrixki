import axios from 'axios';

// posts.json is generated from the Medium feed by scripts/fetch-medium.js
let postsRequest = null;

export const getPosts = () => {
    if (!postsRequest) {
        postsRequest = axios.get(process.env.PUBLIC_URL + '/posts.json')
        .then( res => res.data )
        .catch( err => {
            postsRequest = null;
            throw err;
        } );
    }
    return postsRequest;
};

const safeDecode = text => {
    try {
        return decodeURIComponent(text);
    } catch (e) {
        return text;
    }
};

// Also matches old WordPress slugs (aliases) so old links still work.
export const getPostBySlug = slug => {
    slug = safeDecode(slug).replace(/\/+$/, '');
    return getPosts().then( posts => posts.find( post =>
        safeDecode(post.slug) === slug || (post.aliases || []).includes(slug)
    ) );
};
