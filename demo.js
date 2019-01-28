(function(){
    //初始化变量
    var oStartBtn = document.getElementsByClassName('startBtn')[0], //获取游戏开始按钮
        oMinefield = document.getElementsByClassName('minefield')[0],//获取 雷区域范围
        oFlagBox = document.getElementsByClassName('flagBox')[0], //获取剩余雷数边界
        oAlertBox = document.getElementsByClassName('alertBox')[0], // 获取游戏结束弹框
        oCloseBtn = document.getElementsByClassName('closeBtn')[0],//关闭游戏按钮
        mineNumber = 10, //设置雷数
        isStart = false, //标记游戏是否开始
        mineMap = [], // 布雷图初始化
        block //雷区中雷点对象
    
    bindEvent()

        //事件绑定
    function bindEvent(){

        oStartBtn.onclick = function(){
            // console.log(this)
            if( isStart == false ){ //判断游戏是否开始
                this.style.display = 'none' //游戏开始，开始按钮隐藏
                oMinefield.style.display = 'block' //游戏开始，显示雷区
                oFlagBox.style.display = 'block' //游戏开始，显示剩余雷数
                init() //进入主程序
                isStart = true //标记游戏为开始状态
            }
        }

        //取消雷区及遮罩层右击默认事件
        oMinefield.oncontextmenu = function(){
            return false
        }
        oAlertBox.oncontextmenu = function(){
            return false
        }

        //鼠标在雷区被按下，判断被按下的是 左键？ 右键？
        oMinefield.onmousedown = function(e){
            var event = e.target
            if(e.which == 1) { //左键
                leftClick(event)
            }else if (e.which == 3){ //右键
                rightClick(event)
            }

        }
        //关闭遮罩层，游戏进入初始界面
        oCloseBtn.onclick = function(){
            oMinefield.innerHTML = '' // 清除所有雷点
            oStartBtn.style.display = 'block'//游戏结束，显示开始按钮
            oMinefield.style.display = 'none' //游戏结束，雷区隐藏
            oFlagBox.style.display = 'none' //游戏结束，剩余雷数隐藏
            oAlertBox.style.display = 'none' //游戏结束，遮罩层隐藏
            isStart = false,//标记游戏为开始状态
            mineNumber = 10 ,//初始化雷数
            oFlagBox.firstElementChild.innerHTML = mineNumber //初始化剩余雷数标记
        }
        
    }
  
    //初始化函数 生成雷点，并布雷
    function init(){
        var mine = 10 //设置埋雷数量

        //生成 10 X 10 100个雷点
        for(var i = 0; i < 10; i++){
            for(var j = 0; j < 10 ; j++){
                var dom = document.createElement('div') //创建新的雷点-->div元素
                dom.classList.add('block')  //给新雷点元素添加Class类名
                dom.setAttribute('id', i + '-' + j)  //给新雷点元素设置 唯一Id，方便后续布雷
                mineMap.push({mine:0}) // 为新元素添加此雷点的雷数
                oMinefield.appendChild(dom) //将新的雷点元素插入到雷区中
            }
        }
        //埋雷
        block = document.getElementsByClassName('block')
        while(mine){
            var n = Math.floor(Math.random() * 100) //随机生成 0到99 的整数
            if(mineMap[n].mine == 0){ 
                mineMap[n].mine = 1
                block[n].classList.add('mine')
                mine--
            }
        }
    }
    //鼠标左键单击
    function leftClick(dom){

        // 判断该雷点是否被插过旗子 是则左键点击无效
        if(dom && dom.classList.contains('checked')){
            return 
        }
        //点到了雷点，游戏结束
        var mineAll = document.getElementsByClassName('mine') //获取所有埋地雷的雷点
        if( dom && dom.classList.contains('mine')){ 
            for(var i = 0; i < mineAll.length; i++){
                mineAll[i].classList.add('leidian')
            }
            setTimeout(function(){
                oAlertBox.style.display = 'block'  
                oAlertBox.firstElementChild.style.backgroundImage = 'url("./img/over.jpg")'
            },500)
        }else{
 
            var domIdArr = dom && dom.getAttribute('id').split('-'), //获取元素id，并将其拆分成数组
                posX =  domIdArr && +domIdArr[0], //定义元素X坐标
                posY = domIdArr && +domIdArr[1], // 定义元素Y坐标
                n = 0

            //标记该雷点已经被点击过了  
            dom && (dom.classList.add('num'))

            //判断dom周围8个元素是否有雷，有则雷数++  递归出口
            for(var i = posX - 1; i <= posX + 1; i++){
                for ( var j = posY - 1; j <= posY + 1; j++){
                    var roundDom  = document.getElementById( i + '-' + j )
                    if(roundDom && roundDom.classList.contains('mine')){
                        n++

                    }
                }
            }
            dom && (dom.innerHTML = n)
            if(n == 0){
                for(var i = posX - 1; i <= posX + 1; i++){
                    for ( var j = posY - 1; j <= posY + 1; j++){
                        var nearBox  = document.getElementById( i + '-' + j )
                        if(nearBox && nearBox.length != 0)
                            if(!nearBox.classList.contains('flag')){
                                nearBox.classList.add('flag') //标记改雷点已经被查看过了
                                leftClick(nearBox) //递归调用
                            }
                        }
                    }
                }
                
            }

    }

    //鼠标右键单击
    function rightClick(dom){

        //左键点击过的区域右击无效
        if(dom && dom.classList.contains('num')){
            return 
        }

        //切换dom的Class类名状态，已经标注过的，删除类名，没有标注过的，添加类名
        dom && dom.classList.toggle('checked')

        // 雷点被埋了雷的 且被标注过，雷数--，否则++ 
        if(dom && dom.classList.contains('mine') ){
            dom.classList.contains('checked') ? mineNumber-- : mineNumber++    
        }

        //改名剩余雷数标记
        oFlagBox.firstElementChild.innerHTML = mineNumber

        //雷全部被标注，游戏胜利，结束游戏
        if(mineNumber == 0){
            setTimeout(function(){
                oAlertBox.style.display = 'block'
                oAlertBox.firstElementChild.style.backgroundImage = 'url("./img/success.png")'
            },500)
        }
    }
}())
