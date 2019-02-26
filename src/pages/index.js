import React from 'react';
import { Link } from "react-router-dom";
import Layout from '../components/layout';
import Typed from 'typed.js';
import WorkBlock from '../components/work-block';
import axios from 'axios';
import PostImage from '../components/post-image';
import Helmet from "react-helmet";

/* smooth scroll function */
function scrollIt(destination, duration = 200, easing = 'linear', callback) {

    const easings = {
      linear(t) {
        return t;
      },
      easeInQuad(t) {
        return t * t;
      },
      easeOutQuad(t) {
        return t * (2 - t);
      },
      easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      },
      easeInCubic(t) {
        return t * t * t;
      },
      easeOutCubic(t) {
        return (--t) * t * t + 1;
      },
      easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
      },
      easeInQuart(t) {
        return t * t * t * t;
      },
      easeOutQuart(t) {
        return 1 - (--t) * t * t * t;
      },
      easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
      },
      easeInQuint(t) {
        return t * t * t * t * t;
      },
      easeOutQuint(t) {
        return 1 + (--t) * t * t * t * t;
      },
      easeInOutQuint(t) {
        return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
      }
    };
  
    const start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
  
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = typeof destination === 'number' ? destination : destination.offsetTop;
    const destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
  
    if ('requestAnimationFrame' in window === false) {
      window.scroll(0, destinationOffsetToScroll);
      if (callback) {
        callback();
      }
      return;
    }
  
    function scroll() {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      const timeFunction = easings[easing](time);
      window.scroll(0, Math.ceil((timeFunction * (destinationOffsetToScroll - start)) + start));
  
      if (window.pageYOffset === destinationOffsetToScroll) {
        if (callback) {
          callback();
        }
        return;
      }
  
      requestAnimationFrame(scroll);
    }
  
    scroll();
}

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
                                            <p>I have rich experience on web development, building and customization.<br />Below are the languages and tools I am familiar with: <br />HTML, CSS, Javascript(React, Vue, Augular), PHP, Ruby on Rails, Wordpress.<br />Feel free to drop me a message with an email.</p>
                                            <p className="resume">
                                                <a className="social-icon linkedin" href="https://www.linkedin.com/in/mingkaiko/" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin-in"></i></a>
                                                <a className="social-icon medium" href="https://www.linkedin.com/in/mingkaiko/" target="_blank" rel="noopener noreferrer"><i className="fab fa-medium-m"></i></a>
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
                                    <WorkBlock name="Senior Software Engineer" link="https://workboard.com" unit="Workboard" year="2018 Oct. - Present" city="Redwood City, U.S." />
                                    <WorkBlock name="Senior Full Stack Developer" link="https://ddstudio.tw" unit="DD Studio" year="2014 Oct. - 2018 Sep." city="Taipei, Taiwan" highlight="startup project TIXINN.com got acquired early 2018" />
                                    <WorkBlock name="Senior Front End Developer" link="http://afusion.com" unit="Asia Fusion Technology" year="2013 May. - 2014 Sep." city="Taipei, Taiwan" />
                                    <WorkBlock name="Software Engineer" link="http://www.itstrategists.com" unit="IT Strategists" year="2012-2013 Apr." city="Los Angeles, U.S." />                                                                       
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
                                                <h2 className="post-title">{post.title.rendered}</h2>
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
