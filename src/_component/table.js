import React, {Component} from 'react';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,TableFooter} from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ActionDone from 'material-ui/svg-icons/action/done';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import P from '../_modules/public';

const style={
    but:{

    }
}

class WTable extends Component {
    render() {
        let keys=[];
        let header=this.props.keys.map(function (ele) {
            if(ele.key)
                keys.push(ele.key);
            return ele.name;
        });
        let rows=this.props.data.map((ele,i)=>(
            <Row 
                keys={keys} 
                data={ele} 
                active={this.props.active} 
                key={i}
                columnProps={this.props.columnProps}
                rowProps={this.props.rowProps}
            />)
        );
        let hraders=header.map((ele,i)=>(
            <TableHeaderColumn {...this.props.headerColumnProps} key={i}>
                {ele}
            </TableHeaderColumn>)
        );
        let page=null;
        if(this.props.page&&this.props.page>1){
            page=<Page page={this.props.page} value={(this.props.pageValue)} onChange={this.props.pageChange}/>;
        }
        return (
            <div>
                <Table {...this.props.tableProps}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false} {...this.props.headerProps}>
                        <TableRow {...this.props.rowProps} columnProps={this.props.columnProps} onClick={()=>false}>
                            {hraders}
                        </TableRow>
                    </TableHeader>
                    <TableBody>  
                        {rows}
                    </TableBody>
                </Table>
                {page}
            </div>
        );
    }
}

class Row extends Component {
    constructor(props, context) {
        super(props, context);
        this.click = this.click.bind(this);
    }
    
    click(){
        if(this.props.rowProps.onClick)
            this.props.rowProps.onClick(this.props.data);
    }
    render() {
        let columns;
        if(this.props.isArray)
            columns=this.props.data.map(function (ele,index,arr) {
                return (<TableRowColumn {...this.props.columnProps} key={index}>{ele}</TableRowColumn>);
            },this);
        else
            columns=this.props.keys.map(function (key,index,arr) {
                return (<TableRowColumn {...this.props.columnProps} key={index}>{this.props.data[key]}</TableRowColumn>);
            },this);
        if(this.props.active){
            let Active=this.props.active;
            columns.push(<TableRowColumn {...this.props.columnProps} key={columns.length}>
                <Active data={this.props.data}/>
            </TableRowColumn>);
        }
        return (
            <TableRow {...this.props.rowProps} onClick={this.click}>
                {columns}
            </TableRow>
        );
    }
}

class Page extends Component{
    constructor(props, context) {
        super(props, context);
        this.state={
            value:props.value||1,
            focus:false
        };
        this.change = this.change.bind(this);
        this.textChange = this.textChange.bind(this);
        this.next = this.next.bind(this);
        this.last = this.last.bind(this);

        P.rebuild(this);//对组件做一些处理
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.value&&nextProps.value!=this.state.value)
            this.setState({value:nextProps.value});   
    }   

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.page!=this.props.page||nextState.value!=this.state.value||nextState.focus!=this.state.focus)
            return true;
        else
            return false;
    }
    
    
    
    change(event, index, val){
        event.stopPropagation();
        if(val!=this.state.value){
            this.setState({value:val});
            this.onChange(val);
        }
    }
    textChange(event, val){
        event.stopPropagation();
        if(!val||val===''){
            this.setState({value:val});
            return;
        }
        val=parseInt(val);
        if(!isNaN(val)&&val!=this.state.value&&val<=this.props.page){
            this.setState({value:val});
        }
    }
    next(){
        if(this.state.value<this.props.page){
            let val=this.state.value+1;
            this.setState({value:val});
            this.onChange(val);
        }
    }
    last(){
        if(this.state.value>1){
            let val=this.state.value-1;
            this.setState({value:val});
            this.onChange(val);
        }
    }
    onChange(val){
        if(this.props.onChange)
                this.props.onChange(val);
    }

    setFocus(value){
        if(this.setFocus._time_id)
            clearTimeout(this.setFocus._time_id);
        this.setFocus._time_id=setTimeout(()=>this.setState({focus:value}),100);
    }
    
    render() {
        let items=[],max,min,maxPage=6;
        min=this.state.value-maxPage/2;
        if(min<1)min=1;
        max=min+maxPage;
        if(max>this.props.page)max=this.props.page;
        for(let i=min;i<=max;i++){
            items.push(<MenuItem key={i} value={i} primaryText={i} />);
        }
        let a=this.props.page-1;
        if(max<=a){
            if(max<a)
                items.push(<MenuItem key={'..'} value={'...'} primaryText='...' />);
            items.push(<MenuItem key={this.props.page} value={this.props.page} primaryText={this.props.page} />);
        }
        if(min>=2){
            if(min>2)
                items.unshift(<MenuItem key={'...'} value={'...'} primaryText='...' />);
            items.unshift(<MenuItem key={1} value={1} primaryText='1' />);
        }
        
        let s_display='inline-block',t_display='none';
        if(this.state.focus){
            s_display='none';
            t_display='inline-block';
        }
        return (
            <div style={{textAlign: 'center'}}>
                <IconButton touch={true} onClick={this.last}>
                    <NavigationChevronLeft/>
                </IconButton>   
                <TextField
                    name='page_input'
                    value={this.state.value}
                    style={{width:'3em',verticalAlign: 'bottom'}}
                    inputStyle={{textAlign: 'center'}}
                    onChange={this.textChange}
                    onFocus={()=>this.setFocus(true)}
                    onBlur={()=>this.setFocus(false)}
                />
                <IconButton touch={true} onClick={()=>this.onChange(this.state.value)} style={{display:t_display}}>
                    <ActionDone/>
                </IconButton>  
                <SelectField
                    value={this.state.value}
                    style={{width:'1em',verticalAlign:'bottom',display:s_display}}
                    labelStyle={{color:'transparent'}}
                    onChange={this.change}
                    maxHeight={200}
                >
                    {items}
                </SelectField>
                <IconButton touch={true} onClick={this.next}>
                    <NavigationChevronRight/>
                </IconButton>                 
            </div>
        );
    }
}

export default WTable;