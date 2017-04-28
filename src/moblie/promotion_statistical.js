import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import HardwareKeyboardArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import HardwareKeyboardArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'

import {ThemeProvider} from '../_theme/default';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

// _user.customer.custTypeId=9; //测试专用

var uid,activityId,activityType,sellerId,marcompanyId,pertypeId,busmanageId;
class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            platform:"",
            statiType:"0",
            marAct:"0",
            busMan:'0',
            marType:'0',
            mType:true,
            subordinate:'',
            submarcount:'',
            markPerson:'',
            marcount:'',
            topAccount:[],
            marke_act:[],
            bus_manage:[],
            managelen:true,
            mark_person:[],
            mark_per_count:[],
            subord:[],
            subord_count:[]
        }
        this.platform = this.platform.bind(this);
        this.stypeChange = this.stypeChange.bind(this);
        this.marActChange = this.marActChange.bind(this);
        this.busManChange = this.busManChange.bind(this);
        this.marTypeChange = this.marTypeChange.bind(this);
        this.subordinateChange = this.subordinateChange.bind(this);
        this.submarcountChange = this.submarcountChange.bind(this);
        this.markPersonChange = this.markPersonChange.bind(this);
        this.marcountChange = this.marcountChange.bind(this);

        this.display = {display:'block'};
        this.display1 = {display:'block'};
        this.display2 = {display:'none'};
        this.display3 = {display:'none'};
        this.display4 = {display:'none'};
        this.display5 = {display:'none'};
        this.bus_manage = {};
        this.mark_person = {};
        this.topAccount = {};
        this.data = {
            topuid:_user.customer.custTypeId==9?'>0':_user.customer.objectId,
            marke_act:null,
            busmanageId:_user.employee?_user.employee.objectId:null,
            marType:null,
            marcompanyId:null,
            pertypeId:null,
            count:null,
        };
    }
    componentDidMount() {
        //顶级账号获取所有的品牌商和代理商
        Wapi.customer.list((res) => {
            this.setState({topAccount:res.data})
        },{
            custTypeId:'1|5'
        });
        if(_user.customer.custTypeId==9){
            this.display = {display:'none'};
        };
        if(_user.employee){
            this.display1 = {display:'none'}
            this.display2 = {display:'block'}
            this.setState({statiType:'1'})
        }

        //判断是否为顶级账号
        if(_user.customer.custTypeId!==9){
            //当前公司的营销活动
            Wapi.activity.list((res) => {
                this.setState({marke_act:res.data})
            },{uid:_user.customer.objectId})
            //当前公司的业务经理
            Wapi.employee.list((res) => {
                this.setState({bus_manage:res.data})
            },{
                companyId:_user.customer.objectId,
                type:'<>1',
                isQuit:false
            })
        }

    }
    //平台总览
    platform(e,v,adminId){
        this.setState({platform:adminId})
        this.display={display:'block'}
        this.topAccount=this.state.topAccount[v];
        if(_user.customer.custTypeId==9){ //判断是否为顶级账号
            //当前公司的营销活动
            Wapi.activity.list((res) => {
                this.setState({marke_act:res.data})
            },{uid:this.state.topAccount[v].objectId})
             //当前公司的业务经理
            Wapi.employee.list((res) => {
                this.setState({bus_manage:res.data})
                this.setState({busMan:'0'})
            },{
                companyId:this.state.topAccount[v].objectId,
                type:'<>1',
                isQuit:false
            })
        }
        this.stypeChange();
        this.setState({statiType:'0'});
        uid = this.state.topAccount[v].objectId;
        this.data = {
            topuid:uid,
            marke_act:null,
            busmanageId:null,
            marType:null,
            marcompanyId:null,
            pertypeId:null,
            count:null,
        }
    }
    //统计类别
    stypeChange(e,v,adminId){
        this.busManChange();//刷新一下
        this.setState({statiType:adminId});
        this.setState({busMan:'0'})//恢复业务经理默认值
        this.setState({marAct:'0'});//恢复营销活动默认值
        
        if(v == 1){
            this.display1={display:'none'}
            this.display2={display:'block'}
        }else{
            this.display1={display:'block'}
            this.display2={display:'none'}
        }

        this.data = {
            topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
            marke_act:null,
            busmanageId:null,
            marType:null,
            marcompanyId:null,
            pertypeId:null,
            count:null,
        }
    }
    //营销活动
    marActChange(e,v,adminId){
        this.setState({marAct:adminId})
        if(v>0){
            activityId = this.state.marke_act[v-1].objectId,  //活动
            this.data = {
                topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
                marke_act:activityId,
                busmanageId:null,
                marType:null,
                marcompanyId:null,
                pertypeId:null,
                count:null,
            }
        }else{
            this.data.marke_act=null;
        }
        
    }
    //业务经理
    busManChange(e,v,adminId){
        this.setState({busMan:adminId})
        this.marTypeChange();//刷新一下
        this.setState({marType:'0'})//恢复营销类别默认值
        this.setState({markPerson:''})//恢复集团营销默认值
        this.setState({marcount:''})//恢复集团营销账号默认值
        this.setState({subordinate:''})//恢复渠道营销默认值
        this.display3={display:'none'}
        if(v>0){
            this.setState({managelen:false})
            this.bus_manage = this.state.bus_manage[v-1];
            busmanageId = this.state.bus_manage[v-1].objectId;
            this.data = {
                topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
                marke_act:null,
                busmanageId:busmanageId,
                marType:null,
                marcompanyId:null,
                pertypeId:null,
                count:null,
            }
        }else{
            busmanageId = null
            this.data.busmanageId=null;
            this.setState({managelen:true})
        }
    }
    //营销类别
    marTypeChange(e,v,adminId){
        if(v == 1){
           this.setState({marType:adminId,mType:false});
           this.display3={display:'block'};
           this.display4={display:'none'};
           this.display5={display:'none'};
           if(_user.customer.custTypeId != 9){//判断是否为顶级账号
                if(_user.employee){//如果是业务经理
                    Wapi.customer.list(res => { //获取渠道营销
                        this.setState({subord:res.data})
                    },{parentMng:'^'+_user.employee.objectId,custTypeId:8})
                }else{
                    if(this.state.managelen){//未选业务经理按照公司过滤
                        Wapi.customer.list(res => { //获取渠道营销列表
                            this.setState({subord:res.data})
                        },{parentId:_user.customer.objectId,custTypeId:8})
                    }else{
                        Wapi.customer.list(res => { //获取渠道营销列表
                            this.setState({subord:res.data})
                        },{parentMng:'^'+this.bus_manage.objectId,custTypeId:8})
                    }
                }
            }else{
                if(this.state.managelen){//未选业务经理按照公司过滤
                    Wapi.customer.list(res => { //获取渠道营销列表
                        this.setState({subord:res.data})
                    },{parentId:this.topAccount.objectId,custTypeId:8})
                }else{
                    Wapi.customer.list(res => { //获取渠道营销列表
                        this.setState({subord:res.data})
                    },{parentMng:'^'+this.bus_manage.objectId,custTypeId:8})
                }
            }
            activityType = 3
            this.data = {
                topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
                marke_act:null,
                busmanageId:_user.employee?_user.employee.objectId:busmanageId,
                marType:activityType,
                marcompanyId:null,
                pertypeId:null,
                count:null,
            }
        }else if(v == 2){
            this.setState({marType:adminId,mType:true})
            this.display3={display:'block'};
            this.display4={display:'none'};
            this.display5={display:'none'};
            if(_user.customer.custTypeId != 9){//判断是否为顶级账号
                if(_user.employee){//如果是业务经理
                    Wapi.department.list(res => { //获取集团营销
                        this.setState({mark_person:res.data})
                    },{adminId:_user.employee.objectId})
                }else{
                    if(this.state.managelen){//未选业务经理按照公司过滤
                        Wapi.department.list(res => { //获取集团营销列表
                            this.setState({mark_person:res.data})
                        },{uid:_user.customer.objectId,type:1})
                    }else{
                        Wapi.department.list(res => { //获取集团营销列表
                            this.setState({mark_person:res.data})
                        },{adminId:this.bus_manage.objectId})
                    }
                }
            }else{
                if(this.state.managelen){//未选业务经理按照公司过滤
                    Wapi.department.list(res => { //获取集团营销列表
                        this.setState({mark_person:res.data})
                    },{uid:this.topAccount.objectId,type:1})
                }else{
                    Wapi.department.list(res => { //获取集团营销列表
                        this.setState({mark_person:res.data})
                    },{adminId:this.bus_manage.objectId})
                }
            }

            activityType = 1
            this.data = {
                topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
                marke_act:null,
                busmanageId:_user.employee?_user.employee.objectId:busmanageId,
                marType:activityType,
                marcompanyId:null,
                pertypeId:null,
                count:null,
            }
            
        }else if(v == 0){
            this.display3={display:'none'}
            this.display4={display:'none'}
            this.display5={display:'none'}
            this.data = {
                topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
                marke_act:null,
                busmanageId:_user.employee?_user.employee.objectId:busmanageId,
                marType:null,
                marcompanyId:null,
                pertypeId:null,
                count:null,
            }
        }
        this.setState({marType:adminId })
        this.setState({mark_person:[]})//恢复集团营销列表默认值
        this.setState({mark_per_count:[]})//恢复集团营销账号列表默认值
        this.setState({markPerson:''})//恢复集团营销默认值
        this.setState({marcount:''})//恢复集团营销账号默认值
        this.setState({subord:[]})//恢复渠道营销列表默认值
        this.setState({subord_count:[]})//恢复渠道营销账号列表默认值
        this.setState({submarcount:''})//恢复渠道营销账号默认值
        this.setState({subordinate:''})//恢复渠道营销默认值
    }
    //渠道营销
    subordinateChange(e,v,adminId){
        this.setState({subordinate:adminId})
        this.setState({submarcount:''})
        if(v<0){
            this.display4={display:'none'}
        }else{
             this.display4={display:'block'}
        }

        Wapi.employee.list(res => {
            this.setState({subord_count:res.data})
        },{companyId:this.state.subord[v].objectId})

        marcompanyId = this.state.subord[v].objectId
        this.data = {
            topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
            marke_act:null,
            busmanageId:_user.employee?_user.employee.objectId:busmanageId,
            marType:activityType,
            marcompanyId:marcompanyId,
            pertypeId:null,
            count:null,
        }
    }
    //渠道营销的营销账号
    submarcountChange(e,v,adminId){
        this.setState({submarcount:adminId})
        

        sellerId = this.state.subord_count[v].objectId;
        this.data = {
            topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
            marke_act:null,
            busmanageId:_user.employee?_user.employee.objectId:busmanageId,
            marType:activityType,
            marcompanyId:marcompanyId,
            pertypeId:null,
            count:sellerId,
        }
    }
    //集团营销
    markPersonChange(e,v,adminId){
        this.setState({markPerson:adminId});
        console.log(adminId,'adminId')
        if(v<0){
            this.display5={display:'none'}
        }else{
             this.display5={display:'block'}
        }
        Wapi.employee.list(res => {
            this.setState({mark_per_count:res.data});
        },{departId:this.state.mark_person[v].objectId});

        this.setState({marcount:''});

        pertypeId = this.state.mark_person[v].objectId
        this.data = {
            topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
            marke_act:null,
            busmanageId:_user.employee?_user.employee.objectId:busmanageId,
            marType:activityType,
            marcompanyId:null,
            pertypeId:pertypeId,
            count:null,
        }
    }
    //集团营销的营销账号
    marcountChange(e,v,adminId){
        this.setState({marcount:adminId});


        sellerId = this.state.mark_per_count[v].objectId;
        this.data = {
            topuid:_user.customer.custTypeId==9?uid:_user.customer.objectId,
            marke_act:null,
            busmanageId:_user.employee?_user.employee.objectId:busmanageId,
            marType:activityType,
            marcompanyId:null,
            pertypeId:pertypeId,
            count:sellerId,
        }
    }
    render() {
        // console.log(this.data,'arrBook1')
        // console.log(this.state.managelen,'rf')
        //平台总览
        let top = this.state.topAccount.map((ele,index) => (<MenuItem key={index+1} value={index} primaryText={ele.name}/>))
        //营销活动
        let marke_act = this.state.marke_act.map((ele,index) => (<MenuItem key={index+2} value={index+1} primaryText={ele.name}/>))
        //业务经理
        let bus_manage = this.state.bus_manage.map((ele,index) => (<MenuItem key={index+2} value={index+1} primaryText={ele.name}/>))
        //集团营销
        let mark_person = this.state.mark_person.map((ele,index) => (<MenuItem key={index} value={index} primaryText={ele.name}/>))
        //集团营销账号
        let mark_per_count = this.state.mark_per_count.map((ele,index) => (<MenuItem key={index} value={index} primaryText={ele.name}/>))
        //渠道营销
        let subord = this.state.subord.map((ele,index) => (<MenuItem key={index} value={index} primaryText={ele.name}/>))
        //渠道营销账号
        let subord_count = this.state.subord_count.map((ele,index) => (<MenuItem key={index} value={index} primaryText={ele.name}/>))
        // console.log(this.state.topAccount,'平台总览')
        // console.log(this.state.marke_act,'营销活动')
        // console.log(this.state.bus_manage,'业务经理')
        // console.log(this.state.mark_person,'集团营销')
        // console.log(this.state.mark_per_count,'集团营销账号')
        // console.log(this.state.subord,'渠道营销')
        // console.log(this.state.subord_count,'渠道营销账号')

        let floatsubord = (<div style={{position:'relative'}}>渠道营销<span style={{position:'absolute',right:22}}>{this.state.subordinate===''?this.state.subord.length:''}</span></div>)
        let floatsubord_count = (<div style={{position:'relative'}}>营销账号<span style={{position:'absolute',right:22}}>{this.state.submarcount===''?this.state.subord_count.length:''}</span></div>)
        let floatmark_person = (<div style={{position:'relative'}}>集团营销<span style={{position:'absolute',right:22}}>{this.state.markPerson===''?this.state.mark_person.length:''}</span></div>)
        let floatmark_per_count = (<div style={{position:'relative'}}>营销账号<span style={{position:'absolute',right:22}}>{this.state.marcount===''?this.state.mark_per_count.length:''}</span></div>)
        let subordinate = (
            <div>
                <SelectField floatingLabelText={floatsubord} value={this.state.subordinate} onChange={this.subordinateChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px',width:'100%'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                    {subord}
                </SelectField>
                <div style={this.display4}>
                    <SelectField floatingLabelText={floatsubord_count} value={this.state.submarcount} onChange={this.submarcountChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px',width:'100%'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                        {subord_count}
                    </SelectField>
                </div>
            </div>
        );
        let markPerson = (
            <div>
                <SelectField floatingLabelText={floatmark_person} value={this.state.markPerson} onChange={this.markPersonChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px',width:'100%'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                    {mark_person}
                </SelectField>
                <div style={this.display5}>
                    <SelectField floatingLabelText={floatmark_per_count} value={this.state.marcount} onChange={this.marcountChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px',width:'100%'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                        {mark_per_count}
                    </SelectField>
                </div>
            </div>
        )
        return (
            <ThemeProvider>
                <div style={{padding:'0 10px',marginBottom:30,marginTop:5}}>
                    {
                        _user.customer.custTypeId == 9 ?
                        <SelectField floatingLabelText="平台总览" value={this.state.platform} onChange={this.platform} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                            {top}
                        </SelectField>
                        :
                        <div>
                            <SelectField floatingLabelText="平台总览" value="0" style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                <MenuItem key="1" value="0" primaryText={_user.customer.name}/>
                            </SelectField>
                        </div>
                    }
                    <div style={this.display}>
                        {
                            _user.employee ?
                            <SelectField floatingLabelText="统计类别" value={this.state.statiType}  style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                <MenuItem key="1" value="1" primaryText="按营销渠道统计"/>
                            </SelectField> :
                            <SelectField floatingLabelText="统计类别" value={this.state.statiType}  onChange={this.stypeChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                <MenuItem key="1" value="0" primaryText="按营销活动统计"/>
                                <MenuItem key="2" value="1" primaryText="按营销渠道统计"/>
                            </SelectField>
                        }
                        <div style={this.display1}>
                            <SelectField floatingLabelText="营销活动" value={this.state.marAct} onChange={this.marActChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                <MenuItem key="1" value="0" primaryText="全部"/>
                                {marke_act}
                            </SelectField>
                        </div>
                        <div style={this.display2}>
                            {
                                _user.employee ?
                                <SelectField floatingLabelText="业务经理" value="0" style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                    <MenuItem key="1" value="0" primaryText={_user.employee.name}/>
                                </SelectField>
                                :
                                <SelectField floatingLabelText="业务经理" value={this.state.busMan} onChange={this.busManChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                    <MenuItem key="1" value="0" primaryText="全部"/>
                                    {bus_manage}
                                </SelectField>
                            }

                            <SelectField floatingLabelText="营销类别" value={this.state.marType} onChange={this.marTypeChange} style={{width:'100%',textAlign:'left',height:46,fontSize:12}} floatingLabelStyle={{top: 22,lineHeight:'12px'}} menuStyle={{marginTop: 0}} labelStyle={{lineHeight:'50px',top:0}} iconStyle={{top: 15}} maxHeight={500}>
                                <MenuItem key="1" value="0" primaryText="全部"/>
                                <MenuItem key="2" value="1" primaryText="渠道营销"/>
                                <MenuItem key="3" value="2" primaryText="集团营销"/>
                            </SelectField>
                            <div style={this.display3}>
                                {this.state.mType?markPerson:subordinate}
                            </div>
                        </div>
                    </div>
                    <Static data={Object.assign({},this.data,{type:this.state.statiType})}/>
                </div>
            </ThemeProvider>
        );
    }
}

let styles = {
    head:{listStyle:'none',height:24,padding: '5px 28px 5px 5px',backgroundColor:'#f7f7f7',color:'#333'},
    hebgc:{height:24,backgroundColor:'#f7f7f7',marginTop:20,padding: '5px',color:'#333'},
    height20:{height:24},
    liborder1: {float:'right',padding:'0 5px',minWidth:32,textAlign:'center',color:'#666',fontSize:'14px',lineHeight:'24px'},
    liborder2:{float:'right',padding:'0 5px',minWidth:32,textAlign:'center',color:'#333',fontSize:'14px',lineHeight:'24px'},
    liborder3:{float:'right',padding:'0 5px',minWidth:32,textAlign:'center',color:'#999',fontSize:'14px',lineHeight:'24px'},
    // liborder:{float:'right',padding: '0 4px',minWidth:32,textAlign:'center',color:'#333'},
    list:{listStyle:'none',margin:0},
    left:{display:'inlineBlock',float:'left',fontSize:'14px',lineHeight:'24px'},
    right:{display:'inlineBlock',float:'right',fontSize:'14px',lineHeight:'24px'},
    listright:{listStyle:'none',paddingRight:24,height:24},
    color:{height:20,color:'#ccc'}
}
class Static extends Component {
    constructor(props,context){
        super(props,context)
        this.state = {
            pshow:true,
            rshow:true,
            bshow:true,
            zshow:true,
            arrBook:[],
            arrPro:[],
            product:[],
        }
        this.proshow = this.proshow.bind(this);
        this.readshow = this.readshow.bind(this);
        this.bookingshow = this.bookingshow.bind(this);
        this.regisshow = this.regisshow.bind(this);
        this.getTimes = this.getTimes.bind(this);
        this.date = this.date.bind(this);
        this.only = this.only.bind(this);
    }

    componentDidMount() {
        
    }
   
    componentWillReceiveProps(nextProps){
        if(nextProps&&nextProps.data){
            let op = {
                uid:nextProps.data.topuid,             
                activityId: nextProps.data.marke_act,  
                activityType:nextProps.data.marType,   
                managerId: nextProps.data.busmanageId,
                sellerTypeId: nextProps.data.pertypeId,
                sellerCompanyId: nextProps.data.marcompanyId,
                sellerId: nextProps.data.count,

            }
            let pop = {
                maractcompanyId: nextProps.data.topuid,
                maractivityId: nextProps.data.marke_act,
                busmanageId:nextProps.data.busmanageId,
                martypeId: nextProps.data.marType,
                pertypeId:nextProps.data.pertypeId,
                marcompanyId:nextProps.data.marcompanyId,
                marpersonId: nextProps.data.count,
            }
            Wapi.booking.list(res=>{
                let arr = res.data
                arr.map(ele => {
                    ele.createdAt = this.getTimes(ele.createdAt)
                    return ele
                })
                this.setState({arrBook:arr})
            },op,{limit:-1})

            Wapi.promotion.list(res => {
                let arr = res.data;
                arr.map(ele => {
                    ele.createdAt = this.getTimes(ele.createdAt)
                    return ele
                })
                this.setState({arrPro:arr})
            },pop,{limit:-1})

            //获取所有的产品型号
            Wapi.promotion.list(res => {
                // let arr = res.data;
                let newArr = this.only(res.data) //去掉相同的marproductId
                var that = this;
                if(res.data.length == 0){ //没有数据恢复默认值
                    that.setState({product:[]}); 
                }else{
                    newArr.map((ele,index) => {
                        ele.name='';
                        if(ele.marproductId){
                            Wapi.activityProduct.get(res => {
                                let name = res.data.brand+res.data.name
                                ele.name = name;
                                that.setState({product:newArr}); //Wapi是异步加载
                            },{objectId:ele.marproductId})
                        }
                        
                    })
                }
                // this.setState({allPro:arr});
            },{marcompanyId:nextProps.data.topuid},{limit:-1})  
        } 
    }

    proshow(){
        this.setState({pshow:!this.state.pshow})
    }
    readshow(){
        this.setState({rshow:!this.state.rshow})
    }
    bookingshow(){
        this.setState({bshow:!this.state.bshow})
    }
    regisshow(){
        this.setState({zshow:!this.state.zshow})
    }
    //去重
    only(data){
        var newArr = [];
        var json = {};
        for(var i = 0; i < data.length; i++){
            if(data[i].marproductId){
                if(!json[data[i].marproductId]){
                    newArr.push(data[i]);
                    json[data[i].marproductId] = 1;
                }
            }else {
                if(!json[data[i]]){
                    newArr.push(data[i]);
                    json[data[i]] = 1;
                }
            }
            
        }
        return newArr
    }
    
    //获取毫秒数
    getTimes(times){
        var str = times.toString();
        var p = str.indexOf(".");
        var tt = str.slice(0,p).split("T")
        var cc = [];
        cc.push(tt[0].split("-"))
        cc.push(tt[1].split(":"))
        var time = new Date(cc[0][0],cc[0][1]-1,cc[0][2],parseInt(cc[1][0])+8,cc[1][1],cc[1][2]).getTime()
        return time
    }

    date(data,index){
        var now = new Date();
        var nowDay = now.getDate();
        var nowMonth = now.getMonth();
        var nowYear = now.getFullYear();
        var Yesterday = new Date(nowYear,nowMonth,nowDay-1).getTime();       //昨天开始时间毫秒
        var Today = new Date(nowYear,nowMonth,nowDay).getTime();             //今天开始时间毫秒
        var monthStartDate = new Date(nowYear, nowMonth, 1).getTime();       //本月开始时间毫秒
        var monthEndDate = new Date(nowYear, nowMonth+1, 1).getTime();       //下月开始时间毫秒
        var lastMonthStartDate = new Date(nowYear, nowMonth-1, 1).getTime(); //上月开始时间毫秒
        let YBook = []; //昨天
        let MBook = []; //本月
        let LBook = []; //上月
        data.forEach(ele=>{
            if(ele.createdAt>=Yesterday&&ele.createdAt<Today){
                YBook.push(ele);
            }else if(ele.createdAt>=monthStartDate&&ele.createdAt<monthEndDate){
                MBook.push(ele)
            }else if(ele.createdAt>=lastMonthStartDate&&ele.createdAt<monthStartDate){
                LBook.push(ele)
            }
        })
        switch(index){
            case 1:
                return YBook.length;
                break;
            case 2:
                return MBook.length;
                break;
            case 3:
                return LBook.length;
                break;
            default:
                break;
        }
    }
    render() {
        // let status0 = [];     //已预订
        // let status1 = [];     //已注册
        let stype0 = [];      //本人预订
        let payStatus0 = [];  //零元预订
        let payStatus1 = [];  //付款预订
        let stype1 = [];      //赠送好友
        let fripaySta0 = [];  //零元预订
        let fripaySta1 = [];  //付款预订


        // let H10 = [];         //自由者H10
        // let G9 = [];          //自由者H10

        let type0 = [];      //发送给朋友0 
        let type1 = [];      //分享到朋友圈1
        let type2 = [];      //扫码阅读2
        let type3 = [];      //微信阅读3
        let type4 = [];      //营销资料4

       //添加存储容器
        this.state.product.forEach((ele,index) => {
            ele.data=[];
        });

        //筛选预订
        this.state.arrBook.forEach(ele => {
            if(this.props.data.type != 0){//判断统计类别/按营销渠道统计
                if(ele.activityType==1||ele.activityType==3){//按营销渠道统计中的渠道营销和集团营销
                    if(ele.status0 == 1){
                        // status0.push(ele)
                        // if(ele.status1 == 1){
                        //     status1.push(ele);
                        //     if(ele.product.brand == "自由者"&&ele.product.name == "H10"){
                        //         H10.push(ele)
                        //     }else if(ele.product.brand == "自由者"&&ele.product.name == "G9"){
                        //         G9.push(ele)
                        //     }
                        // }
                        if(ele.type == 0){
                            stype0.push(ele)
                            if(ele.payStatus == 0){
                                payStatus0.push(ele)
                            }else if(ele.payStatus == 1){
                                payStatus1.push(ele)
                            }
                        }else if(ele.type == 1){
                            stype1.push(ele)
                            if(ele.payStatus == 0){
                                fripaySta0.push(ele)
                            }else if(ele.payStatus == 1){
                                fripaySta1.push(ele)
                            }
                        }
                    }
                }
            }else {//按营销活动统计
                if(ele.status0 == 1){
                    // status0.push(ele)
                    // if(ele.status1 == 1){
                    //     status1.push(ele);
                    //     if(ele.product.brand == "自由者"&&ele.product.name == "H10"){
                    //         H10.push(ele)
                    //     }else if(ele.product.brand == "自由者"&&ele.product.name == "G9"){
                    //         G9.push(ele)
                    //     }
                    // }
                    if(ele.type == 0){
                        stype0.push(ele)
                        if(ele.payStatus == 0){
                            payStatus0.push(ele)
                        }else if(ele.payStatus == 1){
                            payStatus1.push(ele)
                        }
                    }else if(ele.type == 1){
                        stype1.push(ele)
                        if(ele.payStatus == 0){
                            fripaySta0.push(ele)
                        }else if(ele.payStatus == 1){
                            fripaySta1.push(ele)
                        }
                    }
                }
            }    
        })
        
        let sum = 0;    //统计注册累计
        let sum1 = 0;   //统计注册上月
        let sum2 = 0;   //统计注册本月
        let sum3 = 0;   //统计注册昨日
        if(this.state.product){
            //筛选注册
            this.state.product.forEach(res =>{
                this.state.arrBook.forEach(ele => {
                    if(this.props.data.type != 0){//判断统计类别/按营销渠道统计
                        if(ele.activityType==1||ele.activityType==3){//按营销渠道统计中的渠道营销和集团营销
                            if(ele.status0 == 1){
                                if(ele.status1 == 1){
                                   if(ele.product.brand+ele.product.name == res.name){
                                        res.data.push(ele);
                                   }
                                }
                            }
                        }
                    }else {//按营销活动统计
                        if(ele.status0 == 1){
                            if(ele.status1 == 1){
                                if(ele.status1 == 1){
                                   if(ele.product.brand+ele.product.name == res.name){
                                       res.data.push(ele)
                                   }
                                }
                            }
                        }
                    }    
                })
            });
            
            var products = this.state.product.map((ele,index) => {
                sum += ele.data.length;
                sum1 += this.date(ele.data,3);
                sum2 += this.date(ele.data,2);
                sum3 += this.date(ele.data,1)
                return (
                    <div style={styles.height20} key={index}>
                        <span style={styles.left}>{ele.name}</span>
                        <ul style={styles.listright}>
                            <li style={styles.liborder2}>{ele.data.length}</li>
                            <li style={styles.liborder2}>{this.date(ele.data,3)}</li>
                            <li style={styles.liborder2}>{this.date(ele.data,2)}</li>
                            <li style={styles.liborder2}>{this.date(ele.data,1)}</li>
                        </ul>
                </div>
                )
            })
        }    
        
        // console.log(sum,'sum')
        // console.log(sum1,'sum1')
        // console.log(sum2,'sum2')
        // console.log(sum3,'sum3')

        //筛选推广和阅读
        this.state.arrPro.forEach(ele => {
            if(this.props.data.type != 0){
                if(ele.martypeId==1||ele.martypeId==3){
                    switch(ele.type){
                        case 0:
                            type0.push(ele);
                            break;
                        case 1:
                            type1.push(ele);
                            break;
                        case 2:
                            type2.push(ele);
                            break;
                        case 3:
                            type3.push(ele);
                            break;
                        case 4:
                            type4.push(ele);
                    }
                }
            }else {
                switch(ele.type){
                    case 0:
                        type0.push(ele);
                        break;
                    case 1:
                        type1.push(ele);
                        break;
                    case 2:
                        type2.push(ele);
                        break;
                    case 3:
                        type3.push(ele);
                        break;
                    case 4:
                        type4.push(ele);
                }
            }
                    
        })
        // console.log(status0,'已预订')
        // console.log(status1,'已注册')
        // console.log(stype0,'本人预订')
        // console.log(payStatus0,'本人零元预订')
        // console.log(payStatus1,'本人付款预订')
        // console.log(stype1,'赠送好友')
        // console.log(fripaySta0,'赠送零元预订')
        // console.log(fripaySta1,'赠送付款预订')
        // console.log(H10,'H10')
        // console.log(A9,'A9')
        // console.log(arrres,'arrres')

        // console.log(type0,'发送给朋友')
        // console.log(type1,'分享到朋友圈')
        // console.log(type2,'扫码阅读')
        // console.log(type3,'微信阅读')
        // console.log(type4,'营销资料')
        
        

        
        // console.log(newArr,'newArr111');
        // console.log(arrres,'arrres')
        // console.log(this.state.product,'product')
        // console.log(this.props.data,'arrBook111')
        // console.log(this.state.arrBook,'sr')
        // console.log(this.state.arrPro,'arrPro')
        // console.log(this.state.allPro,'allPro')
        let promo = (
            <div style={{padding:'0 5px'}}>
                <div style={styles.height20}>
                    <span style={styles.left}>营销资料</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{type4.length}</li>
                        <li style={styles.liborder2}>{this.date(type4,3)}</li>
                        <li style={styles.liborder2}>{this.date(type4,2)}</li>
                        <li style={styles.liborder2}>{this.date(type4,1)}</li>
                    </ul>
                </div>
                <div style={styles.height20}>
                    <span style={styles.left}>发送给朋友</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{type0.length}</li>
                        <li style={styles.liborder2}>{this.date(type0,3)}</li>
                        <li style={styles.liborder2}>{this.date(type0,2)}</li>
                        <li style={styles.liborder2}>{this.date(type0,1)}</li>
                    </ul>
                </div>
                <div style={styles.height20}>
                    <span style={styles.left}>分享到朋友圈</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{type1.length}</li>
                        <li style={styles.liborder2}>{this.date(type1,3)}</li>
                        <li style={styles.liborder2}>{this.date(type1,2)}</li>
                        <li style={styles.liborder2}>{this.date(type1,1)}</li>
                    </ul>
                </div>
            </div>
        );
        let read = (
            <div style={{padding:'0 5px'}}>
                <div style={styles.height20}>
                    <span style={styles.left}>扫码</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{type2.length}</li>
                        <li style={styles.liborder2}>{this.date(type2,3)}</li>
                        <li style={styles.liborder2}>{this.date(type2,2)}</li>
                        <li style={styles.liborder2}>{this.date(type2,1)}</li>
                    </ul>
                </div>
                <div style={styles.height20}>
                    <span style={styles.left}>微信</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{type3.length}</li>
                        <li style={styles.liborder2}>{this.date(type3,3)}</li>
                        <li style={styles.liborder2}>{this.date(type3,2)}</li>
                        <li style={styles.liborder2}>{this.date(type3,1)}</li>
                    </ul>
                </div>
            </div>
        );
        let booking=(
            <div style={{padding:'0 5px'}}>
                <div style={styles.height20}>
                    <span style={styles.left}>本人预订</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{payStatus0.length+payStatus1.length}</li>
                        <li style={styles.liborder2}>{this.date(payStatus0,3)+this.date(payStatus1,3)}</li>
                        <li style={styles.liborder2}>{this.date(payStatus0,2)+this.date(payStatus1,2)}</li>
                        <li style={styles.liborder2}>{this.date(payStatus0,1)+this.date(payStatus1,1)}</li>
                    </ul>
                </div>
                <div style={styles.color}>
                    <span style={styles.left}>零元预订</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder3}>{payStatus0.length}</li>
                        <li style={styles.liborder3}>{this.date(payStatus0,3)}</li>
                        <li style={styles.liborder3}>{this.date(payStatus0,2)}</li>
                        <li style={styles.liborder3}>{this.date(payStatus0,1)}</li>
                    </ul>
                </div>
                <div style={styles.color}>
                    <span style={styles.left}>付款预订</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder3}>{payStatus1.length}</li>
                        <li style={styles.liborder3}>{this.date(payStatus1,3)}</li>
                        <li style={styles.liborder3}>{this.date(payStatus1,2)}</li>
                        <li style={styles.liborder3}>{this.date(payStatus1,1)}</li>
                    </ul>
                </div>
                <div style={styles.height20}>
                    <span style={styles.left}>赠送好友</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{fripaySta0.length+fripaySta1.length}</li>
                        <li style={styles.liborder2}>{this.date(fripaySta0,3)+this.date(fripaySta1,3)}</li>
                        <li style={styles.liborder2}>{this.date(fripaySta0,2)+this.date(fripaySta1,2)}</li>
                        <li style={styles.liborder2}>{this.date(fripaySta0,1)+this.date(fripaySta1,1)}</li>
                    </ul>
                </div>
                <div style={styles.color}>
                    <span style={styles.left}>零元预订</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder3}>{fripaySta0.length}</li>
                        <li style={styles.liborder3}>{this.date(fripaySta0,3)}</li>
                        <li style={styles.liborder3}>{this.date(fripaySta0,2)}</li>
                        <li style={styles.liborder3}>{this.date(fripaySta0,1)}</li>
                    </ul>
                </div>
                <div style={styles.color}>
                    <span style={styles.left}>付款预订</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder3}>{fripaySta1.length}</li>
                        <li style={styles.liborder3}>{this.date(fripaySta1,3)}</li>
                        <li style={styles.liborder3}>{this.date(fripaySta1,2)}</li>
                        <li style={styles.liborder3}>{this.date(fripaySta1,1)}</li>
                    </ul>
                </div>
            </div>
        );

        let regis = (
            <div style={{padding:'0 5px'}}>
                {/*<div style={styles.height20}>
                    <span style={styles.left}>自由者H10</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{H10.length}</li>
                        <li style={styles.liborder2}>{this.date(H10,3)}</li>
                        <li style={styles.liborder2}>{this.date(H10,2)}</li>
                        <li style={styles.liborder2}>{this.date(H10,1)}</li>
                    </ul>
                </div>
                <div style={styles.height20}>
                    <span style={styles.left}>自由者G9</span>
                    <ul style={styles.listright}>
                        <li style={styles.liborder2}>{G9.length}</li>
                        <li style={styles.liborder2}>{this.date(G9,3)}</li>
                        <li style={styles.liborder2}>{this.date(G9,2)}</li>
                        <li style={styles.liborder2}>{this.date(G9,1)}</li>
                    </ul>
                </div>*/}
                {products}
            </div>
        );
        return (
            <div>
                <ul style={styles.head}>
                    <li style={styles.liborder1}>累计</li>
                    <li style={styles.liborder1}>上月</li>
                    <li style={styles.liborder1}>本月</li>
                    <li style={styles.liborder1}>昨日</li>
                </ul>
                <div style={styles.hebgc} onClick={this.proshow}>
                    <span style={styles.left}>推广</span>
                    <span style={styles.right}>{this.state.pshow?<HardwareKeyboardArrowDown />:<HardwareKeyboardArrowUp />}</span>
                    <ul style={styles.list}>
                        <li style={styles.liborder1}>{type0.length+type1.length+type4.length}</li>
                        <li style={styles.liborder1}>{this.date(type0,3)+this.date(type1,3)+this.date(type4,3)}</li>
                        <li style={styles.liborder1}>{this.date(type0,2)+this.date(type1,2)+this.date(type4,2)}</li>
                        <li style={styles.liborder1}>{this.date(type0,1)+this.date(type1,1)+this.date(type4,1)}</li>
                    </ul>
                </div>
                {this.state.pshow?'':promo}
                <div style={styles.hebgc} onClick={this.readshow}>
                    <span style={styles.left}>阅读</span>
                    <span style={styles.right}>{this.state.rshow?<HardwareKeyboardArrowDown />:<HardwareKeyboardArrowUp />}</span>
                    <ul style={styles.list}>
                        <li style={styles.liborder1}>{type2.length+type3.length}</li>
                        <li style={styles.liborder1}>{this.date(type2,3)+this.date(type3,3)}</li>
                        <li style={styles.liborder1}>{this.date(type2,2)+this.date(type3,2)}</li>
                        <li style={styles.liborder1}>{this.date(type2,1)+this.date(type3,1)}</li>
                    </ul>
                </div>
                {this.state.rshow?'':read}
                <div style={styles.hebgc} onClick={this.bookingshow}>
                    <span style={styles.left}>预订</span>
                    <span style={styles.right}>{this.state.bshow?<HardwareKeyboardArrowDown />:<HardwareKeyboardArrowUp />}</span>
                    <ul style={styles.list}>
                        <li style={styles.liborder1}>{payStatus0.length+payStatus1.length+fripaySta0.length+fripaySta1.length}</li>
                        <li style={styles.liborder1}>{this.date(payStatus0,3)+this.date(payStatus1,3)+this.date(fripaySta0,3)+this.date(fripaySta1,3)}</li>
                        <li style={styles.liborder1}>{this.date(payStatus0,2)+this.date(payStatus1,2)+this.date(fripaySta0,2)+this.date(fripaySta1,2)}</li>
                        <li style={styles.liborder1}>{this.date(payStatus0,1)+this.date(payStatus1,1)+this.date(fripaySta0,1)+this.date(fripaySta1,1)}</li>
                    </ul>
                </div>
                {this.state.bshow?'':booking}
                {/*<div style={styles.hebgc} onClick={this.regisshow}>
                    <span style={styles.left}>注册</span>
                    <span style={styles.right}>{this.state.zshow?'▼':'▲'}</span>
                    <ul style={styles.list}>
                        <li style={styles.liborder1}>{H10.length+G9.length}</li>
                        <li style={styles.liborder1}>{this.date(H10,3)+this.date(G9,3)}</li>
                        <li style={styles.liborder1}>{this.date(H10,2)+this.date(G9,2)}</li>
                        <li style={styles.liborder1}>{this.date(H10,1)+this.date(G9,1)}</li>
                    </ul>
                </div>*/}
                 <div style={styles.hebgc} onClick={this.regisshow}>
                    <span style={styles.left}>注册</span>
                    <span style={styles.right}>{this.state.zshow?<HardwareKeyboardArrowDown />:<HardwareKeyboardArrowUp />}</span>
                    <ul style={styles.list}>
                        <li style={styles.liborder1}>{sum}</li>
                        <li style={styles.liborder1}>{sum1}</li>
                        <li style={styles.liborder1}>{sum2}</li>
                        <li style={styles.liborder1}>{sum3}</li>
                    </ul>
                </div>
                {this.state.zshow?'':regis}
            </div>
        );
    }
}

