import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../_theme/default';

import IconButton from 'material-ui/IconButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import AppBar from '../_component/base/appBar';
import SonPage from '../_component/base/sonPage';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

let _product={
    model:'T12',
    price:233,
    install:23,
    reward:32,
    introduction:'http://www.baidu.com',
}
let _list=[];
for(let i=5;i--;){
    let p=Object.assign({},_product);
    _list.push(p);
}
class App extends Component {
    constructor(props,context){
        super(props,context);
        this.state={
            isEdit:false,
        }
        this.data={
            curProduct:{},
            list:[],
        }
        this.add = this.add.bind(this);
        this.edit = this.edit.bind(this);
        this.editBack = this.editBack.bind(this);
    }
    componentDidMount() {
        this.data.list=_list;
        this.forceUpdate();
    }
    
    add(){
        this.setState({isEdit:true});
    }
    edit(product){
        this.data.curProduct=product;
        this.setState({isEdit:true});
    }
    editBack(){
        this.setState({isEdit:false});
    }
    render() {
        return (
            <ThemeProvider>
                <div>
                    <AppBar 
                        title={___.selling_product}
                        iconElementRight={<IconButton onClick={this.add}><ContentAdd/></IconButton>}
                    />
                    <div>
                        <ProductList data={this.data.list} edit={this.edit}/>
                    </div>
                    <SonPage title={___.add_selling_product} open={this.state.isEdit} back={this.editBack}>
                        <EditProduct data={this.data.curProduct}/>
                    </SonPage>
                </div>
            </ThemeProvider>
        );
    }
}
export default App;

class ProductList extends Component {
    render() {
        let data=this.props.data;
        let items=data.map(ele=>{
            <div>sth;</div>
        })
        return (
            <div>
                ProductList
            </div>
        );
    }
}


class EditProduct extends Component {
    render() {
        return (
            <div>
                just edit the selling propduct
            </div>
        );
    }
}
