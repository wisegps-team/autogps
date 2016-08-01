import React, {Component} from 'react';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';

import validationTool from '../_modules/validationTool';

class AddFrom extends Component {
    constructor(props,context) {
        super(props,context);
        this.state={};

        this.handleClose = this.handleClose.bind(this);
        this.makeInput = this.makeInput.bind(this);
        this.submit = this.submit.bind(this);
        this.data={};
        this.validationTool=new validationTool(this.props.table);
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.open!=this.props.open)
        ;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return(!(this.props.open&&nextProps.open)||nextState!=this.state);
    }
    componentWillUpdate(nextProps, nextState) {
        this.data={};
    }
    
    


    setDate(name,val){
        this.data[name]=val;
        let res=this.validationTool.test(this.data);
        this.setState(res);
    }

    handleClose(){
        this.context.openFrom(false);
    };

    makeInput(fie){//根据字段描述返回输入组件
        if(typeof fie.default=='string'&&fie.default[0]=='@')return null;
        let defaultV=this.props.data[fie.name]||fie.default;
        this.data[fie.name]=defaultV;
        switch(fie.display){
            case('TextBox'):
                return (
                    <Input
                        key={fie.name}
                        desc={fie.desc}
                        input={<TextField 
                            hintText={fie.desc} 
                            errorText={this.state[fie.name]}
                            defaultValue={defaultV} 
                            onChange={(e,val)=>this.setDate(fie.name,val)}
                        />}
                    />
                );
            case('Select'):
                let items=fie.validations.select.map(function(ele){
                    return <MenuItem value={ele.value} primaryText={ele.name} key={ele.value}/>;
                });
                defaultV=this.props.data['_selectHandler_value'+fie.name]||fie.default;
                this.data[fie.name]=defaultV;
                return (
                    <Input
                        key={fie.name}
                        desc={fie.desc}
                        input={<SelectField value={defaultV} onChange={()=>1}>
                            {items}
                        </SelectField>}
                    />
                );
            case('DatePicker'):
                this.data[fie.name]=dd(defaultV);
                return (
                    <Input
                        key={fie.name}
                        desc={fie.desc}
                        input={<DatePicker hintText={fie.desc} okLabel={___.ok} cancelLabel={___.cancel} defaultDate={this.data[fie.name]}/>}
                    />
                );
            case('TimePicker'):
                this.data[fie.name]=td(defaultV);
                return (
                    <Input
                        key={fie.name}
                        desc={fie.desc}
                        input={<TimePicker format="24hr" hintText={fie.desc} okLabel={___.ok} cancelLabel={___.cancel} defaultValue={this.data[fie.name]}/>}
                    />
                );
            case('DateTimePicker'):
                return (
                    <Input
                        key={fie.name}
                        desc={fie.desc}
                        input={<DateTimePicker hintText={fie.desc} defaultValue={defaultV}/>}
                    />
                );
            case('UserDefined'):
                return null;
            case('ButtonTextBox'):
                return null;
            case('none'):
                return null;
            default:
                return (
                    <Input
                        key={fie.name}
                        desc={fie.desc}
                        input={<TextField hintText={fie.desc} defaultValue={defaultV}/>}
                    />
                );
        }
    }

    submit(){
        let fromData=this.data;
        let res=this.validationTool.test(fromData);
        if(res){
            let str;
            for(let k in res){
                if(res[k]){
                    str=res[k];
                    break;
                }
            }
            alert(str);
            return;
        }else{
            let pkey=this.props.table.key_primary;
            if(typeof this.props.data[pkey]=='undefined'){
                //新增
                this.context.add(fromData);
            }else{
                //更新
                fromData['_'+pkey]=fromData[pkey];
                delete fromData[pkey];
                this.context.update(fromData);
            }
            this.handleClose();
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="取消"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <FlatButton
                label="确定"
                primary={true}
                onTouchTap={this.submit}
            />,
        ];

        let form=this.props.table.fields.map(this.makeInput);

        return (
            <Dialog
                title={___.add}
                actions={actions}
                modal={false}
                open={this.props.open}
                onRequestClose={this.handleClose}
                autoScrollBodyContent={true}
                contentStyle={{textAlign:'center'}}
                titleStyle={{paddingTop:'10px',paddingBottom:'10px'}}
            >
                <div style={{display:'inline-table'}}>
                    {form}
                </div>
            </Dialog>
        );
    }
}
AddFrom.contextTypes = {
    Wapi:React.PropTypes.object,
    table:React.PropTypes.object,
    openFrom:React.PropTypes.func,
    add:React.PropTypes.func,
    delete:React.PropTypes.func,
    update:React.PropTypes.func
};

class Input extends Component{
    render() {
        return (
            <div style={{display:'table-row'}}>
                <div style={{textAlign:'right',display:'table-cell',verticalAlign: 'middle'}}>{this.props.desc+'：'}</div>
                <div style={{display:'table-cell'}}>{this.props.input}</div>
            </div>
        );
    }
}

class DateTimePicker extends Component{
    constructor(props){
        super(props);
    }
    change(val,isTime){
        if(isTime)
            this.time=val;
        else
            this.date=val;
        this.value=this.date+' '+this.time;
        this.props.onChange(this.value);
    }
    render() {
        this.date=this.props.defaultValue.slice(0,10);
        this.time=this.props.defaultValue.slice(11);
        this.value=this.props.defaultValue;
        return (
            <div>
                <DatePicker 
                    hintText="请选择日期" 
                    okLabel={___.ok} 
                    cancelLabel={___.cancel} 
                    defaultDate={dd(this.date)}
                    onChange={(obj,val)=>this.change(cd(val))}
                />
                <TimePicker 
                    format="24hr" 
                    hintText="请选择时间" 
                    okLabel={___.ok} 
                    cancelLabel={___.cancel} 
                    defaultTime={td(this.time)}
                    onChange={(obj,val)=>this.change(ct(val),true)}
                />
            </div>
        );
    }
}

//把TimePicker返回店date转换为时间格式
function ct(date){
    return W.dateToString(date).slice(11);
}
//把TimePicker返回店date转换为日期格式
function cd(date) {
    return W.dateToString(date).slice(0,10);
}
//把时间字符串转date
function td(str){
    let d=new Date();
    return d;
}
//把日期字符串转date
function dd(str){
    let d=W.date(str);
    return d;
}

export default AddFrom;