import React from 'react';
import axios from 'axios';
import Helmet from "react-helmet";

class PostImage extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            media: {},
            hasImage: false,
        };
    }

    componentDidMount(){
        if(this.props.media){
            let url = ''+window.apiUrl+'/wp-json/wp/v2/media/'+this.props.media;
            axios.get(url)
            .then( res => {            
                return res.data;
            } )
            .then( media => {
                this.setState((state, props) => ({
                    media: media,
                    hasImage: true,
                }));
            } );
        }
    }

    render(){
        return (
            <div className="feature-image">
                {
                    this.props.og &&  
                    <Helmet>
                        <meta property="og:image" content={this.state.media.source_url} />
                    </Helmet>            
                }
                {
                    this.state.hasImage && 
                    <img src={this.state.media.source_url} alt={this.state.media.alt_text} />
                }
                {
                    !this.state.hasImage && 
                    <img src={require('../static/img/post-placeholder.png')} alt="blog post on matrixki.com" />
                }
            </div>
        );
    }
};
export default PostImage;
