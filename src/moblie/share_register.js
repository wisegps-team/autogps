/**
 * 分享注册页
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';


const thisView=window.LAUNCHER.getView();
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});


class App extends Component {
    constructor(props) {
        super(props);
        this.state={
            show:false
        }
        this.askSetShare = this.askSetShare.bind(this);
    }

    componentDidMount() {
        thisView.addEventListener('show',this.askSetShare);
    }
    componentWillUnmount() {
        thisView.removeEventListener('show',this.askSetShare);
    }
    
    askSetShare(e){
        this.url=e.params;
        if(W.native)
            this.setShare();
        else{
            this.setState({show:false});
            window.addEventListener('nativeSdkReady',e=>this.setShare());
        }
    }
    
    setShare(){
        let name=_user.employee?_user.employee.name:_user.customer.contact;
        var op={
            title: name+'的'+___.invite_regist, // xxx的邀约注册
            desc: _user.customer.name, // 分享描述
            link: this.url, // 分享链接
            imgUrl:'http://h5.bibibaba.cn/wo365/img/s.jpg', // 分享图标
            success: function(){},
            cancel: function(){}
        }
        wx.onMenuShareTimeline(op);
        wx.onMenuShareAppMessage(op);
        this.setState({show:true});
    }

    render() {
        let sty={width:'90%',marginLeft:'5%',marginTop:'20px'};
        let main=this.state.show?[
            ___.share_page,
            <br/>,
            ___.can_regist,
            <img src='../../img/shareTo.jpg' style={{width:'100%'}}/>
        ]:(
            <h3 style={{textAlign:'center'}}>{___.preparing_share}</h3>
        );
        return (
            <div style={sty} >
                {main}
            </div>
        );
    }
}

export default App;