import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import PostImage from '../components/post-image';
import Helmet from "react-helmet";
import { getPosts } from '../global/posts';

const POSTS_PER_PAGE = 9;

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

    componentDidUpdate(prevProps){
        if(prevProps.match.params.pageNum !== this.props.match.params.pageNum){
            this.getPosts(this.props.match.params.pageNum);
        }
    }

    getPosts(page = 1){
        page = parseInt(page) || 1;
        getPosts()
        .then( allPosts => {
            let start = (page - 1) * POSTS_PER_PAGE;
            this.setState({
                totalPages: Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE)),
                posts: allPosts.slice(start, start + POSTS_PER_PAGE),
                currentPage: page
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
                    <meta name="description" content="Mike's personal blog. Just another place to record my life. Build with react + Medium. Will share more about life in silicon valley, programming, coding, startup." />
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
                                            <PostImage src={ post.image } alt={ post.title } substitute="display" />
                                            <h2 className="post-title">{post.title}</h2>
                                            <p className="excerpt">{post.excerpt}</p>
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
                                                    <Link to={"/blog/page/"+(index+1)} className="page-link">{index+1}</Link>
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
