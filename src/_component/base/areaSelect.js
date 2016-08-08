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
            province_id:-1,

            cities:[],
            city:'',
            city_id:-1,

            addresses:[],
            address:'',
            address_id:-1
        };
    }
    componentDidMount() {
        let _this=this;
        Wapi.area.list(function(res){
            let prs=res.data;
            
            _this.setState({
                provinces:prs
            });
        })
    }
    componentWillReceiveProps(newProps){
        if(newProps.value){
            let pr=newProps.value.province;
            let ct=newProps.value.city;
            let ad=newProps.value.address;

            let prs,pr_id,cts,ct_id,ads,ad_id;
            
            Wapi.area.list(function(res){
                prs=res.data;
                pr_id=prs.find(elePr=>{elePr.areaName==pr}).id;

                Wapi.area.list(function(res){
                    cts=res.data;
                    ct_id=cts.find(eleCt=>eleCt.areaName==ct).id;

                    Wapi.area.list(function(res){
                        ads=res.data;
                        if(ads.length!=0){
                            ad_id=ads.find(eleAr=>eleAr.areaName==ad).id;
                        }
                    },{parentId:ct_id});
                },{parentId:pr_id});
            });

            this.setState({
                province:pr,
                province_id:pr_id,

                cities:cts,
                city:ct,
                city_id:ct_id,

                addresses:ads,
                address:ad,
                address_id:ad_id
            });
        }
    }
    provinceChange(e,value){
        let index=value;
        if(index==-1){
            this.setState({
                province:'',
                province_id:-1,

                cities:[],
                city:'',
                city_id:-1,

                addresses:[],
                address:'',
                address_id:-1
            });
        }else{
            let _this=this;
            Wapi.area.list(function(res){
                let cts=res.data;
                _this.setState({
                    province:_this.state.provinces.find(ele=>ele.id==index).areaName,
                    province_id:index,
                    cities:cts,
                    city_id:-1,
                    address_id:-1,
                    addresses:[]
                });
            },{parentId:index});
        }
    }
    cityChange(e,value){
        let index=value;
        if(index==-1){
            this.setState({
                city:'',
                city_id:-1,

                addresses:[],
                address:'',
                address_id:-1
            });
        }else{
            let _this=this;
            Wapi.area.list(function(res){
                let ads=res.data;
                if(ads.length==0){
                    let data={
                        province:this.state.province,
                        city:this.state.city,
                    }
                    _this.props.onChange(data);
                }else{
                    _this.setState({
                        city:_this.state.cities.find(ele=>ele.id==index).areaName,
                        city_id:index,
                        addresses:ads,
                        address_id:-1,
                    });
                }
            },{parentId:index});
        }
    }
    addressChange(e,value){
        let index=value;
        if(index==-1){
            this.setState({
                address:'',
                address_id:-1
            });
        }else{
            this.setState({
                address:this.state.addresses.find(ele=>ele.id==index).areaName,
                address_id:index
            });
            let data={
                province:this.state.province,
                city:this.state.city,
                address:this.state.addresses[index]
            }
            this.props.onChange(data);
        }
    }
    render(){
        let province_options=this.state.provinces.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.areaName} />);
        province_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={"省份"} />);
        
        let city_options=[];
        if(this.state.cities.length)
            city_options=this.state.cities.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.areaName} />);
        city_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={"市"} />);

        let address_options=[];
        if(this.state.addresses.length)
            address_options=this.state.addresses.map(ele=><MenuItem innerDivStyle={styles.menuItem} value={ele.id} key={ele.id} primaryText={ele.areaName} />);
        address_options.unshift(<MenuItem innerDivStyle={styles.menuItem} value={-1} key={-1} primaryText={"区/县"} />);

        return(
            <div>
                <SelectField
                    value={this.state.province_id}
                    onChange={this.provinceChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {province_options}
                </SelectField>

                <SelectField
                    value={this.state.city_id}
                    onChange={this.cityChange.bind(this)}
                    style={styles.select}
                    labelStyle={styles.babel}
                >
                    {city_options}
                </SelectField>

                <SelectField
                    value={this.state.address_id}
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