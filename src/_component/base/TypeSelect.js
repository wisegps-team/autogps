import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


let sty={
    verticalAlign: 'bottom',
}

class TypeSelect extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      value:0,
      types:context.custType
    };
  }

  handleChange(event, index, value){
    this.setState({value:value});
    this.props.onChange(value);
  }
  componentWillReceiveProps(nextProps){
    this.setState({value:parseInt(nextProps.value)});
  }

  render() {
    let items=[];
    this.state.types.map(ele=>{
      items.push(<MenuItem value={ele.id} key={ele.id} primaryText={ele.name}/>)
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
    custType: React.PropTypes.array
}

export default TypeSelect;