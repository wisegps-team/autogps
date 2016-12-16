/**
 * 2016/12/14
 * jianghai
 * 二维码管理页面
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

var thisView=window.LAUNCHER.getView();//第一句必然是获取view

thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

class App extends Component {
    render() {
        return (
            <div>
                qrcode page
            </div>
        );
    }
}

export default App;
