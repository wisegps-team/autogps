/**
 * 2016/12/14
 * jianghai
 * 二维码管理页面
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import AppBar from '../_component/base/appBar';
import Input from '../_component/base/input';

var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
    
    let addView=thisView.prefetch('#add',3);
    ReactDOM.render(<AddQrCode/>,addView);
});

const styles = {
    appBody:{paddingTop:'50px'},
    main:{padding:'10px'},
    center:{textAlign:'center'},
    inputGroup:{display:'block',paddingTop:'1em',paddingBottom:'1em'},
    card:{margin:'10px',padding:'10px'},
    span:{marginRight:'1em'},
    bottom_btn_right:{width:'100%',display:'block',textAlign:'right',paddingTop:'5px'},
};
function combineStyle(arr){
    return arr.reduce((a,b)=>Object.assign({},styles[a],styles[b]));
}

let codes=[];
let code={
    objectId:1,
    name:'业务用',
    openNum:9,
    bindNum:6,
    scanNum:5,
}
for(let i=5;i--;){
    let c=Object.assign({},code);
    c.objectId+=i;
    codes.push(c);
}

class App extends Component {
    constructor(props,context){
        super(props,context);
        this.add = this.add.bind(this);
    }
    add(){
        thisView.goTo('#add');
    }
    render() {
        let data=codes;
        let items=data.map(ele=>
            <Card key={ele.objectId} style={styles.card}>
                <div style={{marginLeft:'3px',marginBottom:'10px'}}>{ele.name}</div>
                <div style={{marginLeft:'3px',fontSize:'0.8em'}}>
                    <span style={styles.span}>{'启用' +' '+ ele.openNum}</span>
                    <span style={styles.span}>{'绑定' +' '+ ele.bindNum}</span>
                    <span style={styles.span}>{'扫描' +' '+ ele.scanNum}</span>
                </div>
                <div style={styles.bottom_btn_right}>
                    <FlatButton label={___.ok} primary={true}/>
                </div>
            </Card>
        );
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.qrcode_manage}
                    style={{position:'fixed',top:'0px'}}
                    iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
                />
                <div style={styles.appBody}>
                    <div style={styles.main}>
                        {items}
                    </div>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


class AddQrCode extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            type:1,
            name:'',
            num:0,
        }
        this.typeChange = this.typeChange.bind(this);
        this.nameChange = this.nameChange.bind(this);
        this.numChange = this.numChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    typeChange(e,k,value){
        console.log(value);
        this.setState({type:value});
    }
    nameChange(e,value){
        console.log(value);
        this.setState({name:value});
    }
    numChange(e,value){
        console.log(value);
        this.setState({num:value});
    }
    submit(){
        if(this.data.name==''){
            W.alert('name empty');
            return;
        }
        if(this.data.num==''){
            W.alert('num empty');
            return;
        }
        console.log('submit');
    }
    render() {
        return (
            <ThemeProvider>
            <div>
                <AppBar 
                    title={___.add}
                    style={{position:'fixed',top:'0px'}}
                />
                <div style={styles.appBody}>
                    <div style={combineStyle(['main','center'])}>
                        
                        <div style={styles.inputGroup}>
                            <span >{___.type}</span>
                            <span style={{paddingLeft:'1em',paddingTop:'20px'}}>
                                <SelectField name='type' value={this.state.type} onChange={this.typeChange} style={{width:'200px',textAlign:'left'}} labelStyle={{top:'0px'}}>
                                    <MenuItem value={1} primaryText="营销资料" />
                                    <MenuItem value={2} primaryText="移车卡" />
                                </SelectField>
                            </span>
                        </div>
                        <div style={styles.inputGroup}>
                            <span >{___.name}</span>
                            <span style={{paddingLeft:'1em'}}>
                                <Input name='name' value={this.state.name} onChange={this.nameChange} style={{height:'30px',width:'200px'}} inputStyle={{height:'20px'}}/>
                            </span>
                        </div>
                        <div style={styles.inputGroup}>
                            <span >{___.num}</span>
                            <span style={{paddingLeft:'1em'}}>
                                <Input name='num' value={this.state.num} onChange={this.numChange} style={{height:'30px',width:'200px'}} inputStyle={{height:'20px'}}/>
                            </span>
                        </div>

                        <RaisedButton onClick={this.submit} label={___.ok} primary={true} style={{marginTop:'20px'}}/>
                    </div>
                </div>
            </div>
            </ThemeProvider>
        );
    }
}


export default App;
