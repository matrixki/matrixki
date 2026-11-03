import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import PostImage from '../components/post-image';
import TagLabel from '../components/tag-label';
import Helmet from "react-helmet";
import { FacebookProvider, Comments } from 'react-facebook';
import { getPostBySlug } from '../global/posts';
import { enhanceCodeBlocks } from '../global/code-blocks';

class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            post: false,
            notFound: false,
        };
        this.contentRef = React.createRef();
    }

    componentDidMount() {
        // get post data
        getPostBySlug(this.props.match.params.slug)
        .then( post => {
            this.setState({
                post: post || false,
                notFound: !post,
            }, () => enhanceCodeBlocks(this.contentRef.current));
            document.body.classList.remove('header-transparent');
        } );
    }

    render(){

        const oneAdContent = `<div id="div-onead-draft"></div>`;

        return (
            <Layout>  
                { this.state.post &&
                <Helmet>
                    <title>{this.state.post.title} | Mike's personal blog</title>
                    <meta name="description" content={ this.state.post.excerpt } />
                    <link rel="canonical" href={ this.state.post.link } />
                </Helmet>
                }
                { this.state.notFound &&
                    <div className="post-page">
                        <div className="container">
                            <h1 className="post-title">Post not found</h1>
                            <p><Link to="/blog">Back to blog</Link></p>
                        </div>
                    </div>
                }
                { this.state.post &&                
                    <div className="post-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb">
                                            <li className="breadcrumb-item">
                                                <Link to="/">Home</Link>
                                            </li>
                                            <li className="breadcrumb-item">
                                                <Link to="/blog">Blog</Link>
                                            </li>
                                            <li className="breadcrumb-item active" aria-current="page">
                                                {this.state.post.title}
                                            </li>
                                        </ol>
                                    </nav>                        
                                </div>
                                <div className="col col-md-10 offset-md-1">
                                    <article className="post-article">
                                        <h1 className="post-title">{this.state.post.title}</h1>
                                        <PostImage src={ this.state.post.image } alt={ this.state.post.title } og={true} />
                                        <div className="post-content" ref={ this.contentRef } dangerouslySetInnerHTML={{__html: this.state.post.content}}></div>
                                        {
                                            this.state.post.tags.length > 0 && this.state.post.tags.map(
                                                tag =>
                                                <TagLabel name={ tag } key={ tag }></TagLabel>
                                            )
                                        }
                                    </article>
                                    <div className="ads">
                                        <div dangerouslySetInnerHTML={{ __html: oneAdContent }} />
                                    </div>
                                    <FacebookProvider appId="442636336610128">
                                        <Comments href={`https://matrixki.com${ this.props.location.pathname }`} />
                                    </FacebookProvider>
                                    <div className="fb-comments" data-href={`https://blog.matrixki.com${ this.props.location.pathname }`} data-width="" data-numposts="5"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Layout>
        );
    }
};
export default Post;
