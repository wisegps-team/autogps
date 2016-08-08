import React, {Component} from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


const _types=["类型1","type2","type3","类型4"];

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
    this.setState({types:_types});
    this.setState({value:Number(this.props.value)})
  }
  componentWillReceiveProps(nextProps){
    this.setState({value:Number(nextProps.value)});
  }

  render() {
    let items=[];
    let len=this.state.types.length;
    for(let i=0;i<len;i++){
      items[i]=<MenuItem value={i} key={i} primaryText={this.state.types[i]} />;
    }
    return (
      <SelectField style={sty} value={this.state.value} onChange={this.handleChange.bind(this)}>
        {items}
      </SelectField>
    );
  }
}

export default TypeSelect;