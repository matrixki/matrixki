import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

class MobileMenu extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="mobile-menu-wrapper">
                <ul className="mobile-menu">
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
        );
    }
}

export default MobileMenu;