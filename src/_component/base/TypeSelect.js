import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const _types=[{id:0,values:'类型1'}]

let sty={
    verticalAlign: 'bottom',
}

class TypeSelect extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value:0,
      types:[]
    };
  }

  handleChange(event, index, value){
    this.setState({value:value});
    this.props.onChange(value);
  }
  componentDidMount(){
    this.setState({types:this.context.user_type});
    this.setState({value:Number(this.props.value)})
  }
  componentWillReceiveProps(nextProps){
    this.setState({value:Number(nextProps.value)});
  }

  render() {
    let items=[];
    this.state.types.map(ele=>{
      items.push(<MenuItem value={ele.id} key={ele.id} primaryText={ele.values}/>)
    });
    return (
      <SelectField style={sty} value={this.state.value} onChange={this.handleChange.bind(this)}>
        {items}
      </SelectField>
    );
  }
}

// 必须指定context的数据类型
TypeSelect.contextTypes={
    user_type: React.PropTypes.array
}

export default TypeSelect;