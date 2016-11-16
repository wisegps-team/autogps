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
    select:{width:'100%',textAlign:'left'},
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
        productId:0,    //产品型号Id
        price:'',       //终端价格
        installationFee:0, //安装费用
        url:'',            //文案链接
        principal:_user.customer.name,          //项目经理
        principalId:_user.customer.objectId,    //项目经理id,默认本公司
        principalTel:_user.mobile,              //项目经理电话
        sellerType:_user.customer.name,         //营销人员(营销人员类型)
        sellerTypeId:_user.customer.objectId,   //营销人员类型id，从type=1的depart里面选，默认本公司
        getCard:false,  //客户经理开卡
        status:1,       //活动状态（1进行中/0已终止）
        type:0,         //0车主营销，1营销活动
        wxAppKey:_user.customer.wxAppKey||'',   //配置公众号才有此项目
    };
    return initData;
}
class EditActivity extends Component {
    constructor(props,context){
        super(props,context);
        this.data=getInitData();
        // this.noEdit=true;

        this.products=[
            {model:___.please_select_model,modelId:0},
        ],
        this.principals=[
            {name:_user.customer.name,objectId:_user.customer.objectId,tel:_user.mobile},
        ];
        this.sellerTypes=[
            {name:_user.customer.name,objectId:_user.customer.objectId},
        ];
        
        this.intent='add';

        this.dataChange = this.dataChange.bind(this);
        this.productChange = this.productChange.bind(this);
        this.principalChange = this.principalChange.bind(this);
        this.sellerTypeChange = this.sellerTypeChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        let flag=0;
        let par1={
            "group":{
                "_id":{
                    "modelId":"$modelId",
                    "model":"$model"
                }
            },
            "sorts":"objectId",
            "uid":_user.customer.objectId
        }//获取设备数组
        Wapi.device.aggr(res=>{
            let devices=res.data.map(ele=>ele._id);
            this.products=this.products.concat(devices);
            flag++;
            if(flag==3){
                this.forceUpdate();
            }
        },par1);

        let par2={
            companyId:_user.customer.objectId,
            type:0  //人员的type=0表示本公司人员
        }//获取人员数组（项目经理）
        Wapi.employee.list(res=>{
            this.principals=this.principals.concat(res.data);
            flag++;
            if(flag==3){
                this.forceUpdate();
            }
        },par2);

        let par3={
            uid:_user.customer.objectId,
            type:1  //部门的type=1表示营销部门
        }//获取营销人员数组
        Wapi.department.list(res=>{
            this.sellerTypes=this.sellerTypes.concat(res.data);
            flag++;
            if(flag==3){
                this.forceUpdate();
            }
        },par3);
    }
    
    componentWillReceiveProps(nextProps) {
        // console.log(nextProps);
        if(nextProps.data){
            this.intent='edit';
            let data=getInitData();
            this.data=Object.assign(data,nextProps.data);
            // if(nextProps.data.uid!=_user.customer.objectId){
            //     this.noEdit=true;
            // }else{
            //     this.noEdit=false;
            // }
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
    principalChange(e,v,k){//+++这里要加入 选当前用户选项（公司管理员），所以要加上判断(未完成)
        this.data.principalId=k;
        this.data.principal=this.principals.find(ele=>ele.objectId==k).name;
        this.data.principalTel=this.principals.find(ele=>ele.objectId==k).tel;
        this.forceUpdate();
    }
    sellerTypeChange(e,v,k){
        this.data.sellerTypeId=k;
        this.data.sellerType=this.sellerTypes.find(ele=>ele.objectId==k).name;
        this.forceUpdate();
    }
    submit(){
        let data=this.data;
        
        if(data.wxAppKey==''){//微信公众号未配置
            W.alert(___.wx_server_null);
            return;
        }
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
        if(data.productId==0){//产品型号不为空
            W.alert(___.product_type+___.not_null);
            return;
        }
        if(data.price==''){//设备价格不为空
            W.alert(___.device_price+___.not_null);
            return;
        }
        if(data.installationFee==''){//安装费用为空则默认为0
            data.installationFee=0;
            // W.alert(___.install_price+___.not_null);
            // return;
        }
        if(data.url==''){//文案链接不为空
            W.alert(___.activity_url+___.not_null);
            return;
        }
        // if(!this.props.isCarownerSeller && data.principalId==0){//项目经理不为空（非车主营销活动）
        //     W.alert(___.project_manager+___.not_null);
        //     return;
        // }
        // if(!this.props.isCarownerSeller && data.sellerTypeId==0){//销售人员类型不为空（非车主营销活动）
        //     W.alert(___.seller+___.not_null);
        //     return;
        // }
        console.log(data);

        if(this.intent=='edit'){//修改
            let _data=Object.assign({},data);

            _data._objectId=data.objectId;
            delete _data.objectId;
            delete _data.status0;
            delete _data.status1;
            delete _data.status2;

            Wapi.activity.update(res=>{
                this.props.editSubmit(data);
                this.data=getInitData();
                this.forceUpdate();
            },_data);

        }else{//添加 如果是车主营销，则type=0,不是则为1
            if(this.props.isCarownerSeller){
                data.type=0;
            }else{
                data.type=1;
            }
            data.uid=_user.customer.objectId;
            Wapi.activity.add(res=>{
                data.objectId=res.objectId;
                data.createdAt=W.dateToString(new Date());

                //额外信息
                data.status0=0;
                data.status1=0;
                data.status2=0;
                data.status3=0;

                this.props.addSubmit(data);
                this.data=getInitData();
                this.forceUpdate();
            },data);
        }
    }
    render() {
        let productItems=this.products.map(ele=>
            <MenuItem key={ele.modelId} value={ele.modelId} primaryText={ele.model} />);
        let principalItems=this.principals.map(el=>
            <MenuItem key={el.objectId} value={el.objectId.toString()} primaryText={el.name} />);
        let selleTypeItems=this.sellerTypes.map(e=>
            <MenuItem key={e.objectId} value={e.objectId.toString()} primaryText={e.name} />);
        let noEdit=this.props.noEdit;
        return (
            <div style={styles.input_page}>
                {/*活动名称*/}
                <Input name='name' floatingLabelText={___.activity_name} value={this.data.name} onChange={this.dataChange} disabled={noEdit} />
                
                {/*佣金标准*/}
                <Input name='reward' floatingLabelText={___.activity_reward+___.yuan} value={this.data.reward} onChange={this.dataChange} disabled={noEdit} />
                
                {/*支付方式*/}
                <SelectField name='pay' floatingLabelText={___.pay_type} value={this.data.pay} style={styles.select} maxHeight={200} disabled={noEdit}>
                    <MenuItem value={0} primaryText={___.wxPay} />
                </SelectField>

                {/*订金标准*/}
                <Input name='deposit' floatingLabelText={___.deposit+___.yuan} value={this.data.deposit} onChange={this.dataChange} disabled={noEdit} />

                {/*预订优惠*/}
                <Input name='offersDesc' floatingLabelText={___.booking_offersDesc+___.characters} value={this.data.offersDesc} onChange={this.dataChange} disabled={noEdit} />

                {/*产品型号*/}
                <SelectField name='productId' floatingLabelText={___.product_type} value={this.data.productId} onChange={this.productChange} style={styles.select} maxHeight={200} disabled={noEdit}>
                    {productItems}
                </SelectField>

                {/*产品链接*/}

                {/*终端价格*/}
                <Input name='price' floatingLabelText={___.device_price+___.yuan} value={this.data.price} onChange={this.dataChange} disabled={noEdit} />

                {/*安装费用*/}
                <Input name='installationFee' floatingLabelText={___.install_price+___.yuan} value={this.data.installationFee} onChange={this.dataChange} disabled={noEdit} />

                {/*活动链接*/}
                <Input name='url' floatingLabelText={___.activity_url} value={this.data.url} onChange={this.dataChange} disabled={noEdit} />
                
                {/*项目经理*/}
                <div style={this.props.isCarownerSeller ? {display:'none'} : {textAlign:'left'}}>
                    <SelectField name='principalId' floatingLabelText={___.project_manager} value={this.data.principalId} onChange={this.principalChange} style={styles.select} maxHeight={200} disabled={noEdit}>
                        {principalItems}
                    </SelectField>
                </div>
                
                {/*营销人员（类型）*/}
                <div style={this.props.isCarownerSeller ? {display:'none'} : {textAlign:'left'}}>
                    <SelectField name='sellerTypeId' floatingLabelText={___.seller} value={this.data.sellerTypeId} onChange={this.sellerTypeChange} style={styles.select} maxHeight={200} disabled={noEdit}>
                        {selleTypeItems}
                    </SelectField>
                </div>

                {/*客户经理开卡*/}
                <div style={styles.input_group}>
                    <Checkbox 
                        name='getCard' 
                        style={{paddingTop:'10px'}} 
                        checked={this.data.getCard}
                        label={___.isgetCard} 
                        onCheck={this.dataChange} 
                        disabled={noEdit}
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
                        disabled={noEdit}
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