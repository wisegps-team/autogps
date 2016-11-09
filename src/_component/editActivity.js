"use strict";
import React, {Component}  from 'react';
import ReactDOM from 'react-dom';

import {ThemeProvider} from '../_theme/default';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';

import Input from '../_component/base/input';
import EmployeeSearch from '../_component/employee_search';
import UserTypeSearch from '../_component/userType_search';


const styles = {
    input_page:{textAlign:'center',width:'90%',marginLeft:'5%',marginRight:'5%'},
    input_group:{marginTop:'0.5em',textAlign:'left'},
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'10px'},
};

const strStatus=[___.terminated,___.ongoing];
function getInitData(){
    const initData={
        name:'',    //活动名称
        reward:'',  //佣金标准
        pay:0,      //佣金支付方式
        deposit:'',     //订金标准
        offersDesc:'',  //预定优惠
        product:'',     //产品型号
        productId:'',   //产品型号Id
        price:'',       //终端价格
        installationFee:'', //安装费用
        url:'',     //文案链接
        principal:'',   //项目经理
        principalId:'', //项目经理id
        getCard:false,  //客户经理开卡
        status:1,   //活动状态（进行中/已终止）
        type:0
    };
    return initData;
}
class EditActivity extends Component {
    constructor(props,context){
        super(props,context);
        this.data=getInitData();
        this.products=[];
        this.intent='add';

        this.dataChange = this.dataChange.bind(this);
        this.productChange = this.productChange.bind(this);
        this.principalChange = this.principalChange.bind(this);
        this.sellerTypeChange = this.sellerTypeChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        let par={
            "group":{
                "_id":{
                    "modelId":"$modelId",
                    "model":"$model"
                }
            },
            "sorts":"objectId",
            "uid":_user.customer.objectId
        }
        Wapi.device.aggr(res=>{
            this.products=res.data.map(ele=>ele._id);
            this.forceUpdate();
        },par);
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            console.log('edit');
            this.intent='edit';
            let data=getInitData();
            this.data=Object.assign(data,nextProps.data);
            this.forceUpdate();
        }else{
            this.intent='add';
            this.data=getInitData();
            this.forceUpdate();
        }
    }
    
    dataChange(e,value,key){
        this.data[e.target.name]=value;
        if(e.target.name=='status'){
            this.data.status=Number(value);
            this.forceUpdate();
        }else if(e.target.name=='getCard'){
            this.data.getCard=value;
            this.forceUpdate();
        }
    }
    productChange(e,v,key){
        this.data.productId=key;
        this.data.product=this.products.find(ele=>ele.modelId==key).model;
        this.forceUpdate();
    }
    principalChange(data){
        console.log(data);
        this.data.principal=data.name;
        this.data.principalId=data.objectId;
    }
    sellerTypeChange(data){
        console.log(data);
        this.data.sellerType=data.name;
        this.data.sellerTypeId=data.objectId;
    }
    submit(){
        let data=this.data;
        if(data.name==''){//名称不为空
            W.alert(___.name+___.not_null);
            return;
        }
        if(data.reward==''){//佣金不为空
            W.alert(___.activity_reward+___.not_null);
            return;
        }
        if(data.deposit==''){//订金不为空
            W.alert(___.deposit+___.not_null);
            return;
        }
        if(data.offersDesc==''){//预订优惠不为空
            W.alert(___.booking_offersDesc+___.not_null);
            return;
        }
        if(data.price==''){//设备价格不为空
            W.alert(___.device_price+___.not_null);
            return;
        }
        if(data.installationFee==''){//安装费用不为空
            W.alert(___.install_price+___.not_null);
            return;
        }
        if(data.url==''){//文案链接不为空
            W.alert(___.activity_url+___.not_null);
            return;
        }
        if(data.principal==''){//项目经理不为空
            W.alert(___.project_manager+___.not_null);
            return;
        }
        if(data.sellerType=='' && !this.props.isCarownerSeller){//销售人员类型不为空
            W.alert(___.seller+___.not_null);
            return;
        }

        if(this.intent=='edit'){
            data._objectId=data.objectId;
            delete data.objectId;
            Wapi.activity.update(res=>{
                this.props.editSubmit(data);
                this.data=getInitData();
                this.forceUpdate();
            },data);
        }else{
            data.uid=_user.customer.objectId;
            Wapi.activity.add(res=>{
                data.status0=0;
                data.status1=0;
                data.status2=0;
                data.objectId=res.objectId;
                this.props.addSubmit(data);
                this.data=getInitData();
                this.forceUpdate();
            },data);
        }
    }
    render() {
        let productItems=this.products.map(ele=>
            <MenuItem key={ele.modelId} value={ele.modelId} primaryText={ele.model} />);
        return (
            <div style={styles.input_page}>
                {/*活动名称*/}
                <Input name='name' floatingLabelText={___.activity_name} value={this.data.name} onChange={this.dataChange} />
                
                {/*佣金标准*/}
                <Input name='reward' floatingLabelText={___.activity_reward+___.yuan} value={this.data.reward} onChange={this.dataChange} />
                
                {/*支付方式*/}
                <SelectField name='pay' floatingLabelText={___.pay_type} style={{width:'100%',textAlign:'left'}} value={this.data.pay} onChange={this.dataChange}>
                    <MenuItem value={0} primaryText={___.wxPay} />
                </SelectField>

                {/*订金标准*/}
                <Input name='deposit' floatingLabelText={___.deposit+___.yuan} value={this.data.deposit} onChange={this.dataChange} />

                {/*预订优惠*/}
                <Input name='offersDesc' floatingLabelText={___.booking_offersDesc+___.characters} value={this.data.offersDesc} onChange={this.dataChange} />

                {/*产品型号*/}
                <SelectField name='productId' floatingLabelText={___.product_type} style={{width:'100%',textAlign:'left'}} value={this.data.productId} onChange={this.productChange}>
                    {productItems}
                </SelectField>

                {/*产品链接*/}

                {/*终端价格*/}
                <Input name='price' floatingLabelText={___.device_price+___.yuan} value={this.data.price} onChange={this.dataChange} />

                {/*安装费用*/}
                <Input name='installationFee' floatingLabelText={___.install_price+___.yuan} value={this.data.installationFee} onChange={this.dataChange} />

                {/*活动链接*/}
                <Input name='url' floatingLabelText={___.activity_url} value={this.data.url} onChange={this.dataChange} />
                
                {/*项目经理*/}
                <div style={{textAlign:'left'}}>
                    <EmployeeSearch name='principal' floatText={___.project_manager} defaultValue={this.data.principal} onChange={this.principalChange} data={{companyId:_user.customer.objectId,type:0}}/>
                </div>
                
                {/*营销人员（类型）*/}
                <div style={this.props.isCarownerSeller ? {display:'none'} : {textAlign:'left'}}>
                    <UserTypeSearch name='sellerType' floatText={___.seller} defaultValue={this.data.sellerType} onChange={this.sellerTypeChange} data={{uid:_user.customer.objectId,type:1}}/>
                </div>

                {/*客户经理开卡*/}
                <div style={styles.input_group}>
                    <Checkbox 
                        name='getCard' 
                        style={{paddingTop:'10px'}} 
                        checked={this.data.getCard}
                        label={___.isgetCard} 
                        onCheck={this.dataChange} 
                    />
                </div>
                <div style={styles.input_group}>
                    <span style={{fontSize:'0.7em',color:'#999999'}}>{___.status}</span>
                    <Toggle //活动状态（进行中或已终止）
                        name='status' 
                        label={strStatus[this.data.status]} 
                        labelPosition="right" 
                        toggled={Boolean(this.data.status)} 
                        onToggle={this.dataChange}
                    />
                </div>

                <div style={styles.bottom_btn_center}>
                    <RaisedButton label={___.submit} primary={true} onClick={this.submit} />
                </div>
            </div>
        );
    }
}

export default EditActivity;