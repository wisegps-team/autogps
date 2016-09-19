/**
 * 用户搜索组件
 */
import React, {Component} from 'react';
import Input from './base/input';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Menu from 'material-ui/Menu';
import Paper from 'material-ui/Paper';

const sty={
    main:{
        position: 'relative'
    },
    menu:{
        position: 'absolute',
        top: '100%',
        width:'100%',
        zIndex: 1
    }
}

class UserSearch extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[],
            maxHeight:null,
            top:false
        };
        this.change = this.change.bind(this);
        this.open = this.open.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    change(e,val){
        if(val){
            this.setState({value:val});
            let data={
                name:'^'+val
            }
            Wapi.customer.list(res=>{
                let b=this._main.getBoundingClientRect();
                let h=window.screen.availHeight;
                let bo=h-b.bottom;
                let newState={
                    data:res.data,
                    maxHeight:bo
                }
                if(!res.data.length)
                    newState.opne=false;
                if(b.top>bo){//从上面弹出
                    newState.maxHeight=b.top;
                }
                this.setState(newState);
            },Object.assign(data,this.props.data),{limit:10});
        }else{
            this.setState({open:false,value:val});
        }
    }
    open(){
        this.setState({open:true});
    }
    onChange(e){
        let id=e.currentTarget.dataset.value;
        let t=this.state.data.find(e=>e.objectId==id);
        if(t){
            this.props.onChange(t);
            this.setState({value:t.name});
            setTimeout(()=>this.setState({open:false}),300);
        }
    }

    render() {
        let items=this.state.data.map(e=>(<MenuItem onTouchTap={this.onChange} data-value={e.objectId} primaryText={e.name} key={e.objectId}/>));
        let menuStyle=Object.assign({},sty.menu);
        menuStyle.display='none';
        if(this.state.open)
            menuStyle.display='block';
        return (
            <div style={sty.main} ref={e=>this._main=e}>
                <Input 
                    onChange={this.change} 
                    hintText={___.search_user} 
                    onClick={this.open}
                    value={this.state.value}
                />
                <Paper style={menuStyle}>
                    {items}
                </Paper>
            </div>
        );
    }
}

export default UserSearch;