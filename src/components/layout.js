import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import MobileMenu from '../components/mobile-menu';

class Layout extends React.Component {

    constructor(props) {
        super(props);
        let today = new Date();
        this.year = today.getFullYear();
    }

    render() {

        return ( 
            <div>
                <Header />
                <MobileMenu />
                { this.props.children }
                <Footer year={this.year} />
            </div>
        );
    }
}

export default Layout;