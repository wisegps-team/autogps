import React, {Component} from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const sty={
    position: 'fixed',
    bottom: '1em',
    right: '1em'
}

class Fab extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            hide:false
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if(this.props!==nextProps)
            return true;
        if(this.state.hide!==nextState.hide)
            return true;
        return false;
    }
    
    componentDidMount() {
        if(!Fab._fabs.length)
            document.addEventListener('scroll',Fab.scroll);
        Fab._fabs.push(this);
    }
    componentWillUnmount() {
        Fab._fabs=Fab._fabs.filter((ele)=>ele!=this);
        if(!Fab._fabs.length)
            document.removeEventListener('scroll',Fab.scroll);
    }
    
    
    render() {
        let style=this.state.hide?Object.assign({},sty,{display:'none'}):sty;
        return (
            <FloatingActionButton secondary={true} style={style} {...this.props}>
                <ContentAdd />
            </FloatingActionButton>
        );
    }
}
Fab._fabs=[];
Fab.scroll=function (e) {
    let h=document.body.getBoundingClientRect().bottom-document.documentElement.clientHeight;
    let s={
        hide:(h<50)
    };
    Fab._fabs.forEach(function(element) {
        element.setState(s);
    }, this);
}

export default Fab;