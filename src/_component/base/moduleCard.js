import React, {Component} from 'react';


const sty={
    main:{
        textAlign: 'center',
        width: '33.333%',
        padding: '2em 0',
        fontSize: '13px',
        color: '#4d4d4d',
        borderBottom: '1px solid #eee',
        borderRight: '1px solid #eee',
        position: 'relative',
        display: 'inline-block'
    },
    title:{
        display: 'block'
    }
}

class ModuleCard extends Component {
    constructor(props, context) {
        super(props, context);
        this.click = this.click.bind(this);
    }
    
    click(){
        this.context.view.goTo(this.props.href+'.js');
    }
    render() {
        return (
            <div style={sty.main} onClick={this.click} {...this.props}>
                {this.props.icon}
                <span style={sty.title}>{this.props.title}</span>
            </div>
        );
    }
}

ModuleCard.contextTypes={
    view:React.PropTypes.object
}

export default ModuleCard;