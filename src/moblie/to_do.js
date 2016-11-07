const thisView=window.LAUNCHER.getView();//第一句必然是获取view
thisView.addEventListener('load',function(){
    this.innerHTML='<h1>暂未开放</h1>';
});