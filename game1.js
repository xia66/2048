/* 
* @Author: Marte
* @Date:   2017-10-24 19:50:40
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-04 21:00:41
*/
var game={//游戏对象
    //用于实验的错误数据
    overdata:[
        [3,5,9,17], 
        [11,0,13,0],
        [1,2,3,7],
        [0,25,0,3]
    ],
    data:[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],//保存所有数字的二维数组
    rn:4, //总行数
    cn:4, //总列数
    state: 0, //游戏当前状态：Running|GameOver
    RUNNING:1,
    GAMEOVER:0,
    score:0, //分数
    //判断游戏是否结束
    isGameOver:function(){
        if(!this.isFull()){
            return false;
        }else{
            //最右边和下边不用判断不用判断
            for(var i=0;i<this.rn-1;i++){
                for(var j=0;j<this.cn-1;j++){
                    if(this.data[i][j]==this.data[i+1][j]){
                        return false;
                    }
                    if(this.data[i][j]==this.data[i][j+1]){
                        return false;
                    }                    
                }
            }
            return true;
        }
    },
    isFull:function(){
        for(var i=0;i<this.rn;i++){
            for(var j=0;j<this.cn;j++)
                if(this.data[i][j]==0){
                    return false;
                }
        }
        return true;
    },
    //让页面根据二维数组绘制游戏页面,
    //如果js有多线程的话可以启动一个线程让这个方法一直运行，没有多线程所以需要在每次按下键盘后运行一次方法保证游戏正确
    updateView:function(){
        for(var i=0;i<this.rn;i++){
            for(var j=0;j<this.cn;j++){
                    var num=this.data[i][j];
                    var div=document.getElementById("c"+i+j);
                    div.innerHTML=num;
                    if(num==0){
                        div.className="cell";
                        div.innerHTML="";
                    }
                    else{
                        div.className="cell n"+num;//这里包含两个类名，cell和n(2/4/8..)
                        div.innerHTML=num;
                    }
            }
        }
        //下面还应该更新分数以及判断游戏是否结束然后运行游戏结束代码
        var span=document.getElementById("score");
        score.innerHTML=""+this.score;   
        if(this.isGameOver()){
            this.state=this.GAMEOVER;
            var div=document.getElementById("gameOver");
            var finalSocre=document.getElementById("finalScore");
            finalSocre.innerHTML=this.score;
            div.style.display="block";
        }
    },
    //在空白位置随机生成一个数2或4并且更新画面
    randomNum:function(){
        if(this.isFull()) return;//满了就返回
        while(true){
            var row=Math.floor(Math.random()*4);
            var col=Math.floor(Math.random()*4);
            if(this.data[row][col]==0){
                this.data[row][col]=(Math.ceil(Math.random()*2))*2;
                break;
            }
        }
    },
    //动画函数
    //左右移和上下移动画代码位置不一样，上下移如果放在左右移的位置会有bug，而左右移如果放上下移位置
    //则完全没有效果，原因未知。
    anim:function(row,col,nextc,dir){   
        //动画效果在这里执行，不管是单纯移动还是加倍
        //div1是要移动的块，div2是需要移动到的位置的块
        switch (dir){
            case 1:
                var div1=document.getElementById("c"+row+nextc);                   
                break;
            case 2:
                var div1=document.getElementById("c"+nextc+col); 
                break;
            case 3:
                var div1=document.getElementById("c"+row+nextc); 
                break;
            case 4:
                var div1=document.getElementById("c"+nextc+col);
                break;
        }
        //div1往div2移动
        //获得div1的样式对象[document.defaultView.]可省略
        var div1_style=document.defaultView.getComputedStyle(div1, null);
        var div2=document.getElementById("c"+row+col);
        var div2_style=document.defaultView.getComputedStyle(div2,null);
        switch (dir){
            case 1:
                var left=(parseInt(div1_style.left)-parseInt(div2_style.left))/10;
                var times=10;
                var timer=setInterval(function(){
                        div1.style.left=parseInt(div1_style.left)-left+"px";
                        times--;
                        if(times==0){
                            clearInterval(timer);
                            div1.style.left="";div1.style.top="";
                        }
                    },10);
                break;
            case 2:
                var top=(parseInt(div1_style.top)-parseInt(div2_style.top))/10;
                var times=10;
                var timer=setInterval(function(){
                        div1.style.top=parseInt(div1_style.top)-top+"px";
                        times--;
                        if(times==0){
                            clearInterval(timer);
                            div1.style.left="";div1.style.top="";
                        }
                    },10);
                break
            //右移和左移代码完全一样，下移和上移一样
            case 3:
                var left=(parseInt(div1_style.left)-parseInt(div2_style.left))/10;
                var times=10;
                var timer=setInterval(function(){
                        div1.style.left=parseInt(div1_style.left)-left+"px";
                        times--;
                        if(times==0){
                            clearInterval(timer);
                            div1.style.left="";div1.style.top="";
                        }
                    },10);
                break;
            case 4:
               var top=(parseInt(div1_style.top)-parseInt(div2_style.top))/10;
                var times=10;
                var timer=setInterval(function(){
                        div1.style.top=parseInt(div1_style.top)-top+"px";
                        times--;
                        if(times==0){
                            clearInterval(timer);
                            div1.style.left="";div1.style.top="";
                        }
                    },10);
                break;
        }

    },
//左移，方向为1
//基本思路，遍历每个元素，如果这个元素等于0，找到其右边第一个不为零的数，将他们交换
//如果这个元素不等于0，找到其右边第一个不为零的数，如果他们相等，将这个元素乘2，右边数清零
    moveLeft:function(){       
        for(var row=0;row<this.rn;row++){
            //最后一列不用管
            for(var col=0;col<this.cn-1;col++){
                var nextc=this.getRightNext(row,col);
                if(nextc==-1){
                    break;
                }else{
                    //下面是改变二维数组数据
                    if(this.data[row][col]==0){
                        //执行动画
                        this.anim(row,col,nextc,1);
                        this.data[row][col]=this.data[row][nextc];
                        this.data[row][nextc]=0;
                        col--;
                    }else if(this.data[row][col]==this.data[row][nextc]){
                        //执行动画
                        this.anim(row,col,nextc,1);
                        this.data[row][col]*=2;
                        this.data[row][nextc]=0;
                        this.score+=this.data[row][col];
                    }
                   
                }
            }
        }        
    },
    //找到右边第一个不为零的列下标
    getRightNext:function(row,col){
        for(var nextc=col+1;nextc<this.cn;nextc++){
            if(this.data[row][nextc]!=0){
                return nextc;
            }
        }return -1;
    },
//上移,方向为2
    moveUp:function(){
        for(var col=0;col<this.cn;col++){
            //最后一行不用管
            for(var row=0;row<this.rn-1;row++){
                var nextr=this.getDownNext(row,col);
                if(nextr==-1){
                    break;
                }else{
                    //先执行动画再改变游戏数据
                    if(this.data[row][col]==0){
                        //执行动画
                        this.anim(row,col,nextr,2);
                        this.data[row][col]=this.data[nextr][col];
                        this.data[nextr][col]=0;
                        row--;
                    }else if(this.data[row][col]==this.data[nextr][col]){
                        //执行动画
                        this.anim(row,col,nextr,2);
                        this.data[row][col]*=2;
                        this.data[nextr][col]=0;
                        this.score+=this.data[row][col];
                    }
                }
            }
        }
    },
    //找到下边第一个不为零的数的行下标
    getDownNext:function(row,col){
        for(var nextr=row+1;nextr<this.rn;nextr++){
            if(this.data[nextr][col]!=0){
                return nextr;
            }
        }return -1;
    },
//右移
    moveRight:function(){
        for(var row=0;row<this.rn;row++){
            for(var col=this.cn-1;col>0;col--){
                var nextc=this.getLeftNext(row,col);
                if(nextc==-1){
                    break;
                }else{
                    //改变游戏数据
                    if(this.data[row][col]==0){
                        //执行动画
                        this.anim(row,col,nextc,3);
                        this.data[row][col]=this.data[row][nextc];
                        this.data[row][nextc]=0;
                        col++;
                    }else if(this.data[row][col]==this.data[row][nextc]){
                        //执行动画
                        this.anim(row,col,nextc,3);
                        this.data[row][col]*=2;
                        this.data[row][nextc]=0;
                        this.score+=this.data[row][col];
                    }
                }
            }
        }
    },
    //找到左边第一个不为零的数的列下标
    getLeftNext:function(row,col){
        for(var prec=col-1;prec>=0;prec--){
            if(this.data[row][prec]!=0){
                return prec;
            }
        }return -1;
    },
//下移
    moveDown:function(){
        for(var col=0;col<this.cn;col++){
            for(var row=this.rn-1;row>0;row--){
                var nextr=this.getUpNext(row,col);
                if(nextr==-1){
                    break;
                }else{
                    //改变游戏数据
                    if(this.data[row][col]==0){
                        //执行动画
                        this.anim(row,col,nextr,4);
                        this.data[row][col]=this.data[nextr][col];
                        this.data[nextr][col]=0;
                        row++;
                    }else if(this.data[row][col]==this.data[nextr][col]){
                        //执行动画
                        this.anim(row,col,nextr,4);
                        this.data[row][col]*=2;
                        this.data[nextr][col]=0;
                        this.score+=this.data[row][col];
                    }
                }
            }
        }
    },
    //找到上边边第一个不为零的数的行下标
    getUpNext:function(row,col){
        for(var prer=row-1;prer>=0;prer--){
            if(this.data[prer][col]!=0){
                return prer;
            }
        }return -1;
    },
    //游戏开始
    start:function(){
        this.score=0;
        this.data=[
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0]
        ];
        this.randomNum();
        this.randomNum();
        this.updateView();
        this,state=this.RUNNING;
        var div=document.getElementById("gameOver");    
        div.style.display="none";
    }
}
window.onload=function(){
    game.start();
    //控制游戏结束后不接受响应的关键是在键盘响应事件一开始先判断游戏是否结束，没有结束才开始接受键盘响应   
    document.onkeyup=function(){
        if(game.state!=game.gameOver){
            var e=window.event||arguments[0];
            //保存未按键前的二维数组,如果按键后的数组和没按前一样，则不添加新的数字块
            var oldStr=game.data.toString();
            switch(e.keyCode){
                case 37:
                    game.moveLeft();
                    break;
                case 38:
                    game.moveUp();
                    break;
                case 39:
                    game.moveRight();
                    break;
                case 40:
                    game.moveDown();
                    break;
            }
            var newStr=game.data.toString();
            if(oldStr!=newStr){
                setTimeout(function(){
                    game.randomNum();
                    game.updateView();
                }, 100)             
            }
        }
    }

}