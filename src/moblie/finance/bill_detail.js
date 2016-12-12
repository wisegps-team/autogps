import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {ThemeProvider} from '../../_theme/default';

const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    ReactDOM.render(<App/>,thisView);
});

class App extends Component {
    render() {
        return (
            <div>
                bill detail;
            </div>
        );
    }
}

export default App;