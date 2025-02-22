import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import Typed from 'typed.js';
import WorkBlock from '../components/work-block';
import axios from 'axios';
import PostImage from '../components/post-image';
import Helmet from "react-helmet";
import { scrollIt } from '../global/animation';

class Index extends React.Component {

    constructor(props){
        super(props);
        this.typedEl = React.createRef();
        this.state = {
            posts: [],
            headerTransparent: false,
        };
    }

    componentDidMount(){

        if(window.location.pathname==='/'){
            document.body.classList.add('header-transparent');    
        }
        else{
            document.body.classList.remove('header-transparent');
        }

        const options = {
            strings: [
                'Hi! I am Mike.',
                'I am a Software developer.',
                'Welcome to my personal blog.'
            ],
            typeSpeed: 50,
            backSpeed: 50
        };
        this.typed = new Typed(this.typedEl.current, options);

        axios.get(''+window.apiUrl+'/wp-json/wp/v2/posts?per_page=3')
        .then( res => {            
            return res.data;
        } )
        .then( posts => {
            console.log(posts);
            this.setState((state, props) => ({
                posts: posts,
            }));
        } );
    }

    componentWillUnmount(){
        this.typed.destroy();
        // this._isMounted = false;
    }

    triggerScroll(){
        scrollIt(
            document.getElementById('btn-go-next'),
            800,
            'easeOutQuad',
            () => console.log(`Just finished scrolling to ${window.pageYOffset}px`)
        );
    }

    render(){
        return (            
            <Layout>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>Mike's personal blog</title>
                    <meta name="description" content="Mike's personal blog. Just another place to record my life. Build with react + Wordpress api. Will share more about life in silicon valley, programming, coding, startup." />
                    <meta name="keywords" content="Mike, matrixki, programming, coding, javascript, startup"></meta>
                    <meta property="og:image" content={ require('../static/img/mike_avatar.jpg') } />
                </Helmet>                    
                <div className="page-index">
                    <section className="index-top">
                        <h1 className="typed-slogan">
                            <span ref={this.typedEl}></span>
                        </h1>
                        <a href="#next" onClick={this.triggerScroll} className="btn-go-next" id="btn-go-next">
                            <img className="icon" src={require('../static/img/arrow-down.png')} alt="icon arrow down" />
                        </a>
                    </section>
                    {/* <!-- Intro --> */}
                    <section className="index-content">
                        <div id="next">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-3">
                                        <img className="profile-pic" src={require('../static/img/mike_avatar.jpg')} alt="Mike personal profile picture" />
                                    </div>
                                    <div className="col-md-9">
                                        <div className="index-intro">
                                            <h2>I'm Mike Ko, <br />experienced Software engineer focus on web development.</h2>
                                            <p>Over 10 years experience on web development, building and customization.<br />I am familiar with both frontend and backend skills<br />Feel free to drop me a message on Linkedin.</p>
                                            <p className="resume">
                                                <a className="social-icon linkedin" href="https://www.linkedin.com/in/mingkaiko/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                                <a className="social-icon medium" href="https://medium.com/@matrixki" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium-m"></i></a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* <!-- About --> */}
                    <section className="index-content">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h2 className="section-title">About me</h2>
                                </div>
                                <div className="col-12">
                                    <h3 className="section-subtitle">Work Experience</h3>
                                    <WorkBlock name="Senior Software Engineer" link="https://www.doorstead.com/" unit="Doorstead" year="2023 Nov. - Present" city="Taipei, Taiwan (Remote)" />
                                    <WorkBlock name="Senior Staff Software Engineer" link="https://www.paloaltonetworks.com/" unit="Palo Alto Networks" year="2019 July - 2023 July" city="Santa Clara, U.S." />
                                    <WorkBlock name="Senior Software Engineer" link="https://workboard.com" unit="Workboard" year="2018 Oct. - 2019 June" city="Redwood City, U.S." />
                                    <WorkBlock name="Full Stack Developer" link="https://eoscreative.co/" unit="DD Studio(Now: Eos Creative)" year="2014 Oct. - 2018 Sep." city="Taipei, Taiwan" highlights={["AppWorks accelator batch #11", "startup project TIXINN.com got acquired early 2018", "Lead Developer at DD Studio"]} />
                                    <WorkBlock name="Senior Front End Developer" link="http://afusion.com" unit="Asia Fusion Technology" year="2013 May - 2014 Sep." city="Taipei, Taiwan" />
                                    <WorkBlock name="Software Engineer" link="http://www.itstrategists.com" unit="IT Strategists" year="2012 May - 2013 Apr." city="Los Angeles, U.S." />                                                                       
                                </div>
                                <div className="col-12">
                                    <h3 className="section-subtitle">Education</h3>
                                    <WorkBlock name="University of Michigan, Ann Arbor" title="Master degree, Electrical Engineering: Systems (minor: Computer Science)" year="2010-2012" />
                                    <WorkBlock name="National Taiwan University" title="Bachelor degree, Engineering Scrience" year="2004-2008" />                                 
                                </div>
                            </div>
                        </div>
                    </section>   
                    {/* <!-- Blogs --> */}
                    <section className="index-content">
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <h2 className="section-title">Blog</h2>
                                </div>
                                { this.state.posts.length > 0 && this.state.posts.map(
                                    post =>
                                    <div className="col-md-4 col-sm-6" key={post.id}>
                                        <div className="post-block">
                                            <Link to={'/blog/'+post.slug } >
                                                <PostImage media={ post.featured_media ? post.featured_media : false } substitute="display" />
                                                <h2 className="post-title" dangerouslySetInnerHTML={{__html: post.title.rendered}}></h2>
                                                <p className="excerpt" dangerouslySetInnerHTML={{__html: post.excerpt.rendered}}></p>
                                            </Link>
                                        </div>    
                                    </div>
                                ) }
                            </div>
                        </div>
                    </section>                                    
                </div>
            </Layout>
        );
    }
};
export default Index;
