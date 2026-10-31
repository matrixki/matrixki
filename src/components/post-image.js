import React from 'react';
import Helmet from "react-helmet";

const PostImage = (props) => {
    return (
        <div className="feature-image">
            {
                props.og && props.src &&
                <Helmet>
                    <meta property="og:image" content={props.src} />
                </Helmet>
            }
            {
                props.src &&
                <img src={props.src} alt={props.alt || ''} />
            }
            {
                !props.src && props.substitute === 'display' &&
                <img src={require('../static/img/post-placeholder.png')} alt="blog post on matrixki.com" />
            }
        </div>
    );
};
export default PostImage;
