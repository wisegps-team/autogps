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
    bottom_btn_center:{width:'100%',display:'block',textAlign:'center',paddingTop:'15px',paddingBottom:'30px'},
    select:{width:'100%',textAlign:'left'},
};

const strStatus=[___.terminated,___.ongoing];
const strChannel=[___.national_marketing,___.regional_marketing,''];
function getInitData(){
    const initData={
        name:'',    //活动名称
        type:1,     //活动类别 （0，车主营销，1，集团营销，2，员工营销，3渠道营销）
        pay:0,      //佣金支付方式
        deposit:'',     //订金标准
        offersDesc:'',  //预定优惠
        
        //产品相关的字段，理论上除了productId和channel，其他都不再使用 /20170214
        brand:'',       //产品品牌
        product:'',     //产品型号
        productId:0,    //产品型号Id
        price:0,        //终端价格
        installationFee:0,  //安装费用
        reward:0,           //佣金标准

        actProductId:'',    //营销产品ID
        channel:2,          //安装渠道(0为全国安装，1为本地安装)

        url:'',             //文案链接
        imgUrl:'',          //广告图片链接
        principal:_user.customer.name,          //项目经理
        principalId:_user.customer.objectId,    //项目经理id,默认本公司
        principalTel:_user.mobile,              //项目经理电话
        sellerType:_user.customer.name,         //营销人员(营销人员类型)
        sellerTypeId:_user.customer.objectId,   //营销人员类型id，从type=1的depart里面选，默认本公司
        count:false,    //计算提成
        getCard:false,  //客户经理开卡
        status:1,       //活动状态（1进行中/0已终止）
        wxAppKey:_user.customer.wxAppKey||'',   //配置公众号才有此项目
        tel:'',     //咨询电话
    };
    return initData;
}
class EditActivity extends Component {
    constructor(props,context){
        super(props,context);
        this.data=getInitData();

        this.products=[
            {
                objectId:0,
                brand:'',
                name:___.please_select_model,
                productId:0,
                price:0,
                installationFee:0,
                reward:0,
                channel:2
            },
        ],
        this.principals=[
            {name:_user.customer.name,objectId:_user.customer.objectId,tel:_user.mobile},
        ];
        this.sellerTypes=[];
        
        this.intent='add';

        this.dataChange = this.dataChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        this.typeChange = this.typeChange.bind(this);
        this.productChange = this.productChange.bind(this);
        this.principalChange = this.principalChange.bind(this);
        this.sellerTypeChange = this.sellerTypeChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    componentDidMount() {
        W.loading(true);
        let flag=0;

        let uids=_user.customer.parentId.concat(_user.customer.objectId);
        // let par1={
        //     uid:_user.customer.objectId
        // };
        // Wapi.activityProduct.list(res=>{//从营销产品里选择当前活动的产品
        //     let devices=res.data;
        //     this.products=this.products.concat(devices);
        //     flag++;
        //     if(flag==4){
        //         W.loading();
        //         this.forceUpdate();
        //     }
        // },par1);

        let par4={
            uid:uids.join('|')
            // createdActivity:true//不需要判定上级是否创建过营销活动/20170215
        };
        Wapi.activityProduct.list(resParents=>{//上一级的营销产品也添加到当前活动的待选产品
            let devices=resParents.data;
            this.products=this.products.concat(devices);
            flag++;
            if(flag==3){
                W.loading();
                this.forceUpdate();
            }
        },par4);

        let par2={
            companyId:_user.customer.objectId,
            type:0  //人员的type=0表示本公司人员
        }//获取人员数组（项目经理）
        Wapi.employee.list(res=>{
            this.principals=this.principals.concat(res.data);
            flag++;
            if(flag==3){
                W.loading();
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
                W.loading();
                this.forceUpdate();
            }
        },par3);
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.data){
            this.intent='edit';
            let data=getInitData();
            let next=Object.assign({},nextProps.data);
            let product=this.products.find(ele=>ele.objectId==next.actProductId);
            if(!next.actProductId){
                product=this.products.find(ele=>ele.productId==next.productId);
            }

            next.productId=product.productId;
            next.brand=product.brand;
            next.product=product.name;
            next.price=product.price;
            next.installationFee=product.installationFee;
            next.reward=product.reward;

            this.data=Object.assign({},data,next);
            this.forceUpdate();
        }else{
            this.intent='add';
            this.data=getInitData();
            this.forceUpdate();
        }
    }
    fileUpload(e){
        console.log('file upload');
        console.log(e.target.files);
        let h=e.target;
		if(!h.files.length){
			W.alert("未选择文件");
			return;
		}
		var type=h.value.split('.').pop().toLocaleLowerCase();
        var file =h.files[0];
        if((type!="jpg"&&type!="png"&&type!="jpeg")){
            h.value="";
            h.files=null;
            W.alert("抱歉，仅支持的jpg或png或者jpeg图片");
            return;
        }
        W.loading("正在上传文件，请稍等");
        Wapi.file.upload(res=>{
            W.loading();
            if (res && res.status_code) {
                W.errorCode(res);
                return;
            }
            console.log(res);
            this.data.imgUrl=res.image_file_url;
            this.forceUpdate();
        },file,function(s){
            W.loading("正在上传文件，请稍等……"+parseInt(s*100)+'%');
        });
    }
    dataChange(e,value,key){
        this.data[e.target.name]=value;
        if(e.target.name=='status'){
            this.data.status=Number(value);
            this.forceUpdate();
        }else if(e.target.name=='getCard'){
            this.data.getCard=value;
            this.forceUpdate();
        }else if(e.target.name=='count'){
            this.data.count=value;
            this.forceUpdate();
        }
    }
    typeChange(e,v,key){
        this.data.type=key;
        this.forceUpdate();
    }
    productChange(e,v,key){
        let target=this.products.find(ele=>ele.objectId==key);
        this.data.actProductId=target.objectId;
        this.data.channel=target.channel;

        //20170214活动和产品ID关联，理论上下面6个属性不应该继续储存在acitivity中
        this.data.productId=target.productId;
        this.data.brand=target.brand;
        this.data.product=target.name;
        this.data.price=target.price;
        this.data.installationFee=target.installationFee;
        this.data.reward=target.reward;

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
        
        if(this.intent=='add' && data.wxAppKey==''){//微信公众号未配置
            W.alert(___.wx_server_null);
            return;
        }
        if(data.name==''){//名称不为空
            W.alert(___.name+___.not_null);
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
        if(data.url==''){//文案链接不为空
            W.alert(___.activity_url+___.not_null);
            return;
        }
        console.log(data);
        if(this.intent=='edit'){    //修改
            let _data=Object.assign({},data);

            _data._objectId=data.objectId;
            delete _data.objectId;
            delete _data.status0;
            delete _data.status1;
            delete _data.status2;

            Wapi.activity.update(res=>{
                Wapi.activityProduct.update(re=>{
                    this.props.editSubmit(data);
                    this.data=getInitData();
                    this.forceUpdate();
                },{
                    _objectId:data.actProductId,
                    // createdActivity:true
                })
            },_data);

        }else{  //添加
            data.uid=_user.customer.objectId;
            Wapi.activity.add(res=>{
                data.objectId=res.objectId;
                data.createdAt=W.dateToString(new Date());

                //额外信息
                data.status0=0;
                data.status1=0;
                data.status2=0;
                data.status3=0;

                Wapi.activityProduct.update(re=>{
                    this.props.addSubmit(data);
                    this.data=getInitData();
                    this.forceUpdate();
                },{
                    _objectId:data.actProductId,
                    // createdActivity:true
                })

            },data);
        }
    }
    render() {
        // let typeItems=[<MenuItem key={2} value={2} primaryText={___.employee_marketing} />];   //员工营销
        let typeItems=[];
        let va='';
        if(_user.customer.other && _user.customer.other.va){
            va=_user.customer.other.va;//判断当前用户权限，添加营销类别选项 va中0,1,2,3分别表示[集团营销，渠道营销，政企业务，车主营销]
        }
        if(va.includes('3')){
            typeItems.push(<MenuItem key={0} value={0} primaryText={___.carowner_seller} />);   //车主营销
        }
        if(va.includes('1')){
            typeItems.push(<MenuItem key={3} value={3} primaryText={___.subordinate_marketing} />);   //渠道营销
        }
        if(va.includes('0')){
            typeItems.push(<MenuItem key={1} value={1} primaryText={___.group_marketing} />);   //集团营销
        }

        let productItems=this.products.map(ele=>    //产品选项
            <MenuItem key={ele.objectId} value={ele.objectId} primaryText={strChannel[ele.channel]+' '+ele.brand+ele.name} />);

        let selleTypeItems=this.sellerTypes.map(e=> //营销人员（类型）选项
            <MenuItem key={e.objectId} value={e.objectId.toString()} primaryText={e.name} />);

        let noEdit=this.props.noEdit;

        return (
            <div style={styles.input_page}>
                {/*活动名称*/}
                <Input name='name' floatingLabelText={___.activity_name} value={this.data.name} onChange={this.dataChange} disabled={noEdit} />
                
                {/*营销类别*/}
                <SelectField name='actType' floatingLabelText={___.activity_type} value={this.data.type} onChange={this.typeChange} style={styles.select} maxHeight={200} disabled={noEdit}>
                    {typeItems}
                </SelectField>

                {/*营销人员（类型）*/}
                <div style={ this.data.type==1 ? {textAlign:'left'} : {display:'none'} }>
                    <SelectField name='sellerTypeId' floatingLabelText={___.seller} value={this.data.sellerTypeId} onChange={this.sellerTypeChange} style={styles.select} maxHeight={200} disabled={noEdit}>
                        {selleTypeItems}
                    </SelectField>
                </div>
                
                {/*计算提成*/}
                <div style={ (this.data.type==1||this.data.type==3) ? styles.input_group : {display:'none'} }>
                    <Checkbox 
                        name='count' 
                        checked={this.data.count}
                        label={___.calculate_commission} 
                        onCheck={this.dataChange} 
                        disabled={noEdit}
                    />
                </div>

                {/*营销产品型号*/}
                <SelectField name='actProductId' floatingLabelText={___.product_type} value={Number(this.data.actProductId)} onChange={this.productChange} style={styles.select} maxHeight={300} disabled={noEdit}>
                    {productItems}
                </SelectField>

                {/*产品链接*/}

                {/*终端价格*/}
                <Input name='price' floatingLabelText={___.device_price+___.yuan} value={this.data.price.toFixed(2)} disabled={true} />

                {/*安装费用*/}
                <Input name='installationFee' floatingLabelText={___.install_price+___.yuan} value={this.data.installationFee.toFixed(2)} disabled={true} />

                {/*佣金标准*/}
                <Input name='reward' floatingLabelText={___.activity_reward+___.yuan} value={this.data.reward.toFixed(2)} disabled={true} />
                
                {/*支付方式*/}
                <SelectField name='pay' floatingLabelText={___.pay_type} value={this.data.pay} style={styles.select} maxHeight={200} disabled={noEdit}>
                    <MenuItem value={0} primaryText={___.wxPay} />
                </SelectField>

                {/*订金标准*/}
                <Input name='deposit' floatingLabelText={___.deposit+___.yuan} value={this.data.deposit} onChange={this.dataChange} disabled={noEdit} />

                {/*预订优惠*/}
                <Input name='offersDesc' floatingLabelText={___.booking_offersDesc+___.characters} value={this.data.offersDesc} onChange={this.dataChange} disabled={noEdit} />

                {/*活动链接*/}
                <Input name='url' floatingLabelText={___.activity_url} value={this.data.url} onChange={this.dataChange} disabled={noEdit} />

                {/*联系电话*/}
                <Input name='tel' floatingLabelText={___.support_hotline} value={this.data.tel} onChange={this.dataChange} disabled={noEdit} />
                
                {/*广告图片链接*/}
                <div style={styles.input_group}>
                    <div>{___.activity_img_url}</div>
                    <div style={{marginBottom:'5px',fontSize:'10px',color:'#999999'}}>{___.img_standard}</div>
                    <input type="file" capture="camera" name="inputf" accept="image/*" onChange={e=>this.fileUpload(e)}/>
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

                {/*活动状态*/}
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