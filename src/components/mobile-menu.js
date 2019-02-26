import React from 'react';
import { Link } from "react-router-dom";

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
                        <a target="_blank" rel="noopener noreferrer" href="https://igtext.matrixki.com">Igtext</a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default MobileMenu;