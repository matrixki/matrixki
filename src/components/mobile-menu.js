import React from 'react';
import { Link } from "react-router-dom";

class MobileMenu extends React.Component {
    
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        document.body.classList.remove('menu-open');
    }


    render(){
        return (
            <div className="mobile-menu-wrapper">
                <ul className="mobile-menu">
                    <li>
                        <Link to="/" onClick={this.handleClick}>Home</Link>
                    </li>
                    <li>
                        <Link to="/blog" onClick={this.handleClick}>Blog</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default MobileMenu;