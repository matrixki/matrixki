import React from 'react';
class WorkBlock extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="work-block">
                <h5>
                    { this.props.name }
                    { (this.props.link && this.props.unit) ? (' @') : ('') }
                    { 
                        this.props.link && this.props.unit && 
                        <a href={this.props.link} target="_blank" rel="noopener noreferrer">&nbsp;{this.props.unit}</a>
                    }
                </h5>
                { this.props.title && 
                    <label className="title">{this.props.title}</label>
                }
                <label className="year">{this.props.year}</label>
                { this.props.city && 
                    <label className="city">{this.props.city}</label>
                }
                { this.props.highlights && this.props.highlights.length > 0 &&
                    this.props.highlights.map( (highlight, index) => {
                        return (<p key={index} className="highlight">{ highlight }</p>);
                    })
                }
            </div>
        );
    }
};
export default WorkBlock;
