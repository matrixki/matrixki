import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Layout from '../components/layout';
import axios from 'axios';
import PostImage from '../components/post-image';
import Helmet from "react-helmet";

class Blog extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            posts: [],
        };
    }

    componentDidMount(){
        axios.get(''+window.apiUrl+'/wp-json/wp/v2/posts?per_page=9')
        .then( res => {            
            return res.data;
        } )
        .then( posts => {
            console.log(posts);
            this.setState((state, props) => ({
                posts: posts,
            }));
            document.body.classList.remove('header-transparent');
        } );
    }

    render(){
        return (
            <Layout>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Blog | Mike's personal blog</title>
                    <meta name="description" content="Mike's personal blog. Just another place to record my life. Build with react + Wordpress api. Will share more about life in silicon valley, programming, coding, startup." />
                    <meta name="keywords" content="Mike, matrixki, programming, coding, javascript, startup, blog"></meta>                    
                    <meta property="og:image" content={ require('../static/img/post-placeholder.png') } />
                </Helmet>                
                <div className="blog-page">
                    <div className="container">
                    <div className="row">
                            <div className="col-12">
                                <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Blog
                                    </li>
                                </ol>
                            </nav>                        
                            </div>
                            <div className="col-12">
                                <h1 className="section-title">Mike's Blog</h1>
                            </div>
                            { this.state.posts.length > 0 && this.state.posts.map(
                                post =>
                                <div className="col-md-4 col-sm-6" key={post.id}>
                                    <div className="post-block">
                                        <Link to={ '/blog/' + post.slug }>
                                            <PostImage media={ post.featured_media ? post.featured_media : false } />
                                            <h2 className="post-title">{post.title.rendered}</h2>
                                            <p className="excerpt" dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}></p>
                                        </Link>
                                    </div>    
                                </div>
                            ) }
                        </div>                    
                    </div>
                </div>    
            </Layout>
        );
    }
};
export default Blog;
