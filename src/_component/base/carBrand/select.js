import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import carBrandAction from './action';
import Avatar from 'material-ui/Avatar';
import AppBar from '../appBar';
import Subheader from 'material-ui/Subheader';
import ActionSearch from 'material-ui/svg-icons/action/search';

import IconInput from '../iconInput';

const act=new carBrandAction();

const sty={
    a:{
        boxShadow:'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
    }
}

class Select extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            show:0
        }
        this.data={};
        this.brandChange = this.brandChange.bind(this);
        this.serieChange = this.serieChange.bind(this);
        this.typeChange = this.typeChange.bind(this);
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(nextState.show!=this.state.show);
    }
    
    
    next(){
        let show=this.state.show+1;
        this.setState({show});
    }

    brandChange(id,name){
        if(this.state.show!=0)return;
        this.data.brandId=id;
        this.data.brand=name;
        this.next();
    }

    serieChange(id,name){
        if(this.state.show!=1)return;
        this.data.serieId=id;
        this.data.serie=name;
        this.next();
    }

    typeChange(id,name){
        if(this.state.show!=2)return;
        if(id){
            this.data.typeId=id;
            this.data.type=name;
        }else{
            delete this.data.typeId;
            delete this.data.type;
        }
        setTimeout(()=>this.setState({show:0}),300);
        this.props.onChange(Object.assign({},this.data));
    }
    
    render() {
        let dis=[false,false,false];
        dis[this.state.show]=true;
        return (
            <div>
                <Brands onChange={this.brandChange} display={dis[0]}/>
                <Series onChange={this.serieChange} display={dis[1]} serie={true} parent={this.data.brandId}/>
                <Series onChange={this.typeChange} display={dis[2]} serie={false} parent={this.data.serieId}/>
            </div>
        );
    }
}

class Brands extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            brands:[],
            search:false,
            search_brands:[]
        }
        this.change = this.change.bind(this);
        this.search = this.search.bind(this);
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.display==this.props.display&&nextState==this.state)
            return false;
        else
            return true;
    }
    
    componentDidMount() {
        let that=this;
        Wapi.base.carBrand(function(res){
            that.data=res.data;
            let brands=that.showBrands(res.data);
            that.setState({brands});
        });
    }

    showBrands(data){
        let brands=[],t;
        for(let i=0;i<data.length;i++){
            let ele=data[i]
            if(t!==ele.t_spell){
                t=ele.t_spell;
                brands.push(<Subheader key={t} style={{fontSize:'18px',fontWeight: 700,backgroundColor:this.context.muiTheme.palette.primary3Color}}>{t}</Subheader>)
            }
            brands.push(<ListItem
                primaryText={ele.name}
                leftAvatar={<Avatar src={'http://img.wisegps.cn/logo/'+ele.url_icon} style={sty.a} backgroundColor='#fff'/>}
                onClick={this.change}
                data-id={ele.id}
                data-name={ele.name}
                key={ele.id}
                style={{borderBottom:'1px solid #ccc'}}
            />);
        }
        return brands;
    }

    change(e){
        let id=parseInt(e.currentTarget.dataset.id);
        let name=e.currentTarget.dataset.name;
        this.props.onChange(id,name);
    }

    search(e,val){
        if(val){
            let search_brands=this.showBrands(this.data.filter(ele=>ele.name.toLowerCase().indexOf(val.toLowerCase())!=-1));
            this.setState({search_brands,search:true});
        }else
            this.setState({search:false});
    }

    render() {
        let dis=this.props.display?'block':'none';
        let serarch_dis=this.state.search?'block':'none';
        let _dis=this.state.search?'none':'block';
        return (
            <div style={{display:dis}}>
                <IconInput name='brand_search' hintText={___.search_car_brand} icon={ActionSearch} onChange={this.search}/>
                <List style={{display:_dis}}>
                    {this.state.brands}
                </List>
                <List style={{display:serarch_dis}}>
                    {this.state.search_brands}
                </List>
            </div>
        );
    }
}

Brands.contextTypes = {
    muiTheme: React.PropTypes.object
};


class Series extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            data:[{}]
        }
        this.change = this.change.bind(this);
        this.setData = this.setData.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(!nextProps.parent)return;
        if(nextProps.parent!=this.props.parent){
            this.setState({data:[]});
            let data={
                pid:nextProps.parent
            }
            if(nextProps.serie)
                Wapi.base.carSerie(this.setData,data);
            else
                Wapi.base.carType(this.setData,data);
        }else if(!this.state.data.length){
            this.props.onChange();
        }
    }

    setData(res){
        if(!res||!res.data||!res.data.length){
            this.props.onChange(); 
        }else
            this.setState({data:res.data});
    }
    
    change(e){
        let id=parseInt(e.currentTarget.dataset.id);
        let name=e.currentTarget.dataset.name;
        this.props.onChange(id,name);
    }
    
    render() {
        let items=this.state.data.map(ele=>(<ListItem
            primaryText={ele.name}
            onClick={this.change}
            data-id={ele.id}
            data-name={ele.name}
            key={ele.id}
        />));
        let dis=this.props.display?'block':'none';
        return (
            <List style={{display:dis}}>
                {items}
            </List>
        );
    }
}



export default Select;