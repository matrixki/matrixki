import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import axios from 'axios';
import PostImage from '../components/post-image';
import CatLabel from '../components/cat-label';
import TagLabel from '../components/tag-label';
import Helmet from "react-helmet";


class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            post: false,
        };
    }

    componentDidMount() {
        // get post data
        let url = ''+window.apiUrl+'/wp-json/wp/v2/posts/?slug='+this.props.match.params.slug;
        axios.get(url)
        .then( res => {            
            return res.data[0];
        } )
        .then( post => {
            console.log(post);
            this.setState({
                post: post,
            });
            document.body.classList.remove('header-transparent');
            //activate google ads
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } );
    }

    render(){
        return (
            <Layout>  
                { this.state.post &&
                <Helmet>
                    <title>{ this.state.post.title.rendered } | Mike's personal blog</title>
                    <meta name="description" content={ this.state.post.excerpt.rendered.replace(/<[^>]+>/g, '') } />
                </Helmet>           
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
                                                { this.state.post.title.rendered }
                                            </li>
                                        </ol>
                                    </nav>                        
                                </div>
                                <div className="col col-md-10 offset-md-1">
                                    <article className="post-article">
                                        {   
                                            this.state.post.categories.length > 0 && this.state.post.categories.map(
                                                cat => 
                                                <CatLabel catId={ cat } key={ cat }></CatLabel>
                                            )
                                        }
                                        <h1 className="post-title">{ this.state.post.title.rendered }</h1>
                                        <h2 className="post-excerpt" dangerouslySetInnerHTML={{__html: this.state.post.excerpt.rendered}}></h2>
                                        <PostImage media={ this.state.post.featured_media ? this.state.post.featured_media : false } og={true} />
                                        <div className="post-content" dangerouslySetInnerHTML={{__html: this.state.post.content.rendered}}></div>
                                        {   
                                            this.state.post.tags.length > 0 && this.state.post.tags.map(
                                                tag => 
                                                <TagLabel tagId={ tag } key={ tag }></TagLabel>
                                            )
                                        }
                                    </article>
                                    <div className="ads">
                                        <ins className="adsbygoogle" style={{ display: 'block' }} data-ad-client="ca-pub-2405574601626411" data-ad-slot="8743887896" data-ad-format="auto" data-full-width-responsive="true" />
                                    </div>
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
