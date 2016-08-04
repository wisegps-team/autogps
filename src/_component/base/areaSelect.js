import React, {Component} from 'react';

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

let sty={
    width: '33.33333%',
    verticalAlign: 'bottom',
    textAlign:'center'
}

class AreaSelect extends Component {
    constructor(props, context) {
        super(props, context);
        this.state={
            provinces:[],
            citys:[],
            districts:[],
            value:{
                province_id:null,
                province:null,
                city:null,
                city_id:null,
                district_id:null,
                district:null
            }
        }

        this.provinceChange = this.provinceChange.bind(this);
        this.cityChange = this.cityChange.bind(this);
        this.districtChange = this.districtChange.bind(this);
    }
    
    componentDidMount() {
        //获取省份
        let provinces=[
            {
                id:1,
                name:'广东省',
            },{
                id:2,
                name:'广西省'
            },{
                id:3,
                name:'直辖市/特区'
            }
        ]
        this.setState({provinces});
    }

    provinceChange(event, index, val){
        let value={
            province_id:val,
            province:this.state.provinces[index].name
        };
        this.setState({value});
        this.changeValue(null);                

        //异步获取城市
        let citys=c[val];
        this.setState({citys});
    }

    cityChange(event, index, val){
        let value={
            province:this.state.value.province,
            province_id:this.state.value.province_id,
            city_id:val,
            city:this.state.citys[index].name
        };
        let districts=[];
        this.setState({value,districts});    
        this.changeValue(null);        

        //异步获取区，如果下级没有了，则直接完成
        districts=d[val];
        if(districts.length)
            this.setState({districts});
        else
            this.changeValue(value);            
    }

    districtChange(event,index,val){
        let value=Object.assign({},this.state.value);
        value.district_id=val;
        value.district=this.state.districts[index].name;
        this.setState({value});

        this.changeValue(value);
    }

    changeValue(newValue){
        if(newValue){
            this._return=true;
            this.props.onChange(newValue);
        }else if(this._return)
            this.props.onChange(newValue);       
    }
    
    render() {
        let citySelect=null;
        let disSelect=null;
        let pro=this.state.provinces.map((ele)=><MenuItem key={ele.id} value={ele.id} primaryText={ele.name} />);   
        if(this.state.citys.length){
            citySelect=(<SelectField
                    value={this.state.value.city_id}
                    onChange={this.cityChange}
                    style={sty}
                >
                    {this.state.citys.map((ele)=><MenuItem key={ele.id} value={ele.id} primaryText={ele.name} />)}
                </SelectField>)
        }    
        if(this.state.districts.length){
            disSelect=(<SelectField
                    value={this.state.value.district_id}
                    onChange={this.districtChange}
                    style={sty}                    
                >
                    {this.state.districts.map((ele)=><MenuItem key={ele.id} value={ele.id} primaryText={ele.name} />)}
                </SelectField>)
        }    
        return (
            <div {...this.props}>
                <SelectField
                    value={this.state.value.province_id}
                    onChange={this.provinceChange}
                    style={sty}                    
                >
                    {pro}
                </SelectField>
                {citySelect}
                {disSelect}
            </div>
        );
    }
}
export default AreaSelect;


let c={
    '1':[
        {
            id:11,
            name:'广州'
        },
        {
            id:12,
            name:'深圳'
        }
    ],
    '2':[
        {
            id:21,
            name:'不知道'
        },
        {
            id:22,
            name:'桂林'
        }
    ]
};
let d={
    '11':[
        {
            id:111,
            name:'天河'
        }
    ],
    '12':[
        {
            id:121,
            name:'从化'
        }
    ],
    '21':[
        {
            id:211,
            name:'海珠'
        }
    ],
    '22':[]
}