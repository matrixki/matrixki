import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class Header extends React.Component {
    
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
        };
        this.mobileMenuTrigger = this.mobileMenuTrigger.bind(this);
        this.handleHeaderBackground = this.handleHeaderBackground.bind(this);
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleHeaderBackground);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleHeaderBackground);
    }

    handleHeaderBackground(event) {
        let scrollTop = window.scrollY;
        if(window.location.pathname !== '/'){
            return;
        }
        if(scrollTop>60){
            document.body.classList.remove('header-transparent');
            this.setState({headerTransparent: false});
        }
        else{
            document.body.classList.add('header-transparent');
            this.setState({headerTransparent: true});
        }
    }

    mobileMenuTrigger(event) {
        event.preventDefault();
        if(!this.state.menuOpen){
            document.body.classList.add('menu-open');
            this.setState({menuOpen: true});
        }
        else{
            document.body.classList.remove('menu-open');
            this.setState({menuOpen: false});
        }
        
    }

    render(){
        return (
            <header id="header">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col header-left">
                            <Link to="/" className="logo-text">
                                <span>M</span>
                            </Link>
                        </div>
                        <div className="col header-right">
                            <a href="#" className="btn mobile-menu-trigger d-md-none" onClick={this.mobileMenuTrigger}>
                                <span className="bar"></span>
                                <span className="bar"></span>
                            </a>
                            <ul className="header-menu d-none d-sm-none d-md-block">
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="/blog">Blog</Link>
                                </li>
                                <li>
                                    <a target="_blank" href="https://igtext.matrixki.com">Igtext</a>
                                </li>                                
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default Header;