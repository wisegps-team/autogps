import React, {Component} from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const styles={
    select:{
        overflow:'hidden',
        width: '33.33333%',
        verticalAlign: 'bottom',
        textAlign:'left',
    },
    babel:{
        paddingRight:'20px'
    },
    menuItem:{
        paddingLeft:'5px'
    }
}

export default class AreaSelect extends Component{
    constructor(props,context) {
        super(props,context);
        this.state={
            provinces:[],
            province:'',
            provinceId:-1,

            cities:[],
            city:'',
            cityId:-1,

            addresses:[],
            address:'',
            addressId:-1
        };
    }
    componentDidMount() {
        let _this=this;
        Wapi.area.list(function(res){
            if(res.status_code!=0||res.data.length==0)return;
            let prs=res.data;
            
            _this.setState({
                provinces:prs,
            });
        },{level:1});
    }
    componentWillReceiveProps(newProps){
        if(newProps.value){
            let prs=[];
            let pr=newProps.value.province;
            let pr_id=newProps.value.provinceId;

            let cts=[];
            let ct=newProps.value.city;
            let ct_id=newProps.value.cityId;

            let ads=[];
            let ad=newProps.value.address;
            let ad_id=newProps.value.addressId;

            Wapi.area.list(res=>{
                if(res.status_code!=0||res.data.length==0)return;
                prs=res.data;
            },{level:1});

            Wapi.area.list(res=>{
                if(res.status_code!=0||res.data.length==0)return;
                cts=res.data;
            },{parentId:pr_id});
            
            Wapi.area.list(res=>{
                if(res.status_code!=0||res.data.length==0)return;
                ads=res.data;
            },{parentId:ct_id});

            this.setState({
                province:pr,
                provinceId:pr_id,

                cities:cts,
                city:ct,
                cityId:ct_id,

                addresses:ads,
                address:ad,
                addressId:ad_id
            });
        }
    }
    provinceChange(e,i,value){
        let areaId=value;
        if(areaId==-1){
            this.setState({
                province:'',
                provinceId:-1,

                cities:[],
                city:'',
                cityId:-1,

                addresses:[],
                address:'',
                addressId:-1
            });
        }else{
            let _this=this;
            Wapi.area.list(function(res){
                if(res.status_code!=0||res.data.length==0)return;
                let cts=res.data;
                _this.setState({
                    province:_this.state.provinces.find(ele=>ele.id==areaId).areaName,
                    provinceId:areaId,
                    cities:cts,
                    cityId:-1,
                    addressId:-1,
                    addresses:[]
                });
            },{parentId:areaId});
        }
    }
    cityChange(e,i,value){
        let areaId=value;
        if(areaId==-1){
            this.setState({
                city:'',
                cityId:-1,

                addresses:[],
                address:'',
                addressId:-1
            });
        }else{
            let _this=this;
            Wapi.area.list(function(res){
                if(res.status_code!=0||res.data.length==0)return;
                let ads=res.data;
                if(ads.length==0){
                    let data={
                        province:this.state.province,
                        city:this.state.city,
                    }
                    _this.props.onChange(data);
                }else{
                    _this.setState({
                        city:_this.state.cities.find(ele=>ele.id==areaId).areaName,
                        cityId:areaId,
                        addresses:ads,
                        addressId:-1,
                    });
                }
            },{parentId:areaId});
        }
    }
    addressChange(e,i,value){
        let areaId=value;
        if(areaId==-1){
            this.setState({
                address:'',
                addressId:-1
            });
        }else{
            this.setState({
                address:this.state.addresses.find(ele=>ele.id==areaId).areaName,
                addressId:areaId
            });
            let data={
                province:this.state.province,
                city:this.state.city,
                address:this.state.addresses.find(ele=>ele.id==areaId).areaName
            }
            this.props.onChange(data);
        }
    }
    render(){
        let province_options=this.state.provinces.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.areaName} />);
        province_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={"省份"} />);
        
        let city_options=[];
        if(this.state.cities.length>0)
            city_options=this.state.cities.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.areaName} />);
        city_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={"市"} />);

        let address_options=[];
        if(this.state.addresses.length>0)
            address_options=this.state.addresses.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.areaName} />);
        address_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={"区/县"} />);

        return(
            <div>
                <SelectField
                    value={this.state.provinceId}
                    onChange={this.provinceChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {province_options}
                </SelectField>

                <SelectField
                    value={this.state.cityId}
                    onChange={this.cityChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {city_options}
                </SelectField>

                <SelectField
                    value={this.state.addressId}
                    onChange={this.addressChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {address_options}
                </SelectField>
            </div>
        )
    }
}