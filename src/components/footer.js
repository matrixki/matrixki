import React from 'react';

class Footer extends React.Component {
    
    constructor(props) {
        super(props);
    }

    render(){
        return (
            <footer id="footer">
                <div className="container">
                    <p>&copy; { this.props.year } Mike build with React / React router. All rights reserved.</p>
                    <p>Made with Love and Coffee. Keep caffeinated and carry on.</p>
                </div>
            </footer>
        );
    }
}

export default Footer;