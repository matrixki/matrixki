import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import axios from 'axios';
import PostImage from '../components/post-image';
import Helmet from "react-helmet";

class Blog extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            posts: [],
            totalPages: 1,
            currentPage: 1
        };
    }

    componentDidMount(){
        this.getPosts(this.props.match.params.pageNum);
    }

    getPosts(page = 1){
        let url = window.apiUrl+'/wp-json/wp/v2/posts?per_page=9&page='+page;
        axios.get(url)
        .then( res => {
            return res;
        } )
        .then( res => {
            let posts = res.data;
            this.setState({
                totalPages: parseInt(res.headers['x-wp-totalpages']),
                posts: posts,
                currentPage: parseInt(page)
            });
            document.body.classList.remove('header-transparent');
        } );
    }

    render(){
        let paginationListsSize = Array(this.state.totalPages).fill(1);
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
                                            <PostImage media={ post.featured_media ? post.featured_media : false } substitute="display" />
                                            <h2 className="post-title" dangerouslySetInnerHTML={{__html: post.title.rendered}}></h2>
                                            <p className="excerpt" dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}></p>
                                        </Link>
                                    </div>    
                                </div>
                            ) }
                        </div>
                        { this.state.totalPages > 1 &&
                        <div className="row">
                            <div className="col-12">
                                <ul className="pagination">
                                    { paginationListsSize.map( (value, index) => {
                                        return  <li className={ this.state.currentPage === (index+1) ? "page-item active" : "page-item" } key={index}>
                                                    <Link to={"/blog/page/"+(index+1)} onClick={ () => this.getPosts(index+1)} className="page-link">{index+1}</Link>
                                                </li>
                                    })}
                                </ul>
                            </div>
                        </div>
                        }                   
                    </div>
                </div>    
            </Layout>
        );
    }
};
export default Blog;
