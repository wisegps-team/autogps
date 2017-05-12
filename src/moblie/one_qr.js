import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import AutoList from '../_component/base/autoList';
import Input from '../_component/base/input';

import TextField from 'material-ui/TextField'


const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.setTitle("一物一码");
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);

});

const S_URL='http://autogps.cn/?s=';

class App extends Component {
    constructor(props,context){
        super(props,context)
        this.state ={
            data:[],
            total:null,
            search:[]
        }
        this._data = {
            uid:_user.customer.objectId,
            type:2
        }
        this.op={//控制排序字段与页数
            page:'objectId',
            sorts:'objectId',
            page_no:1
        };
        this.next = this.next.bind(this);
        this.search = this.search.bind(this);
    }
    componentDidMount() {
        thisView.addEventListener('show',e => {
            // console.log(e)
            Wapi.qrDistribution.list(res=>this.setState(res),this._data);
            this.forceUpdate()
        })
        
    }
    next(){
        this.op.page_no++;
        Wapi.qrDistribution.list(res=>{
            let data=this.state.data.concat(res.data);
            res.data=data;
            this.setState(res);
        },this._data,this.op);
    }
    search(e,val){
        if(!val){
            this.setState({search:[]});
            return;
        }
        let data=Object.assign({},this._data);
        data.name='^'+val;
        Wapi.qrDistribution.list(res=>{
            this.setState({search:res.data});
        },data);
    }
    render(){
        // console.log(this.state.data)
        let list=(this.state.data&&this.state.data.length)?(<Alist 
                max={this.state.total} 
                limit={20} 
                data={this.state.data} 
                next={this.next} 
            />):(<h2 style={{color:'#ccc',textAlign:'center',margin:0,paddingTop:20}}>{___.qr_list_null}</h2>);
        let listDis={};
        let searchList=null;
        if(this.state.search.length){
            searchList=<Dlist data={this.state.search}/>;
            listDis.display='none';
        }
        return(
            <ThemeProvider>
                <div style={{background:'#f7f7f7',minHeight:'100vh'}}>
                    <div>
                        {
                            this.state.data&&this.state.data.length?
                            <TextField 
                                hintText={___.search}
                                onChange={this.search}
                                style={{width:'100%',background:'#fff'}} 
                                hintStyle={{paddingLeft:10}}
                                inputStyle={{paddingLeft:10}}
                                underlineStyle={{bottom:'0px',borderBottomColor:'#f7f7f7'}} 
                                underlineFocusStyle={{borderBottomColor:'#2196f3'}}
                            />
                            :
                            null
                        }
                    </div>
                    <div style={listDis}>
                        {list}
                    </div>
                    {searchList}
                </div>
            </ThemeProvider>
        )
    }
}



class Dlist extends Component {
    constructor(props,context){
        super(props,context)
    }
    render() {
        let data=this.props.data
        // console.log(data,'data')
        let items=data.map(ele=>
            <div key={ele.objectId} style={{ padding:'10px',borderBottom:'1px solid #f7f7f7'}}>
                <div style={{marginLeft:'3px',marginBottom:'10px'}}>
                    {ele.name}<br/>
                    <span style={{color:'rgb(84, 175, 185)'}}>{S_URL+ele.min+'-'+ele.max}</span>
                </div>
                <div style={{marginLeft:'3px',fontSize:'0.8em'}}>
                    <span style={{marginRight:'1em'}}>{___.enabled_num+'：'+(ele.num||0)}</span>
                    <span style={{marginRight:'1em'}}>{___.bind_count+'：'+(ele.bind_num||0)}</span>
                    <span style={{marginRight:'1em'}}>{"挪车统计"+'：'+(ele.move_num||0)}</span>
                </div>
            </div>
        );
        return (
            <div style={{background:'#fff'}}>
                {items}
            </div>
        );
    }
}
let Alist=AutoList(Dlist);
