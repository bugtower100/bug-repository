// ==UserScript==
// @name         鼠鼠！规则
// @author       bug人@
// @version      1.0.0
// @description  鼠鼠！掷骰规则，暂时没联动自动卡
// @timestamp    20240710
// @diceRequireVer 1.0.0
// @license      Apache-2
// @homepageURL  https://github.com/sealdice/javascript
// @updateUrl    https://raw.githubusercontent.com/bugtower100/bug-repository/main/js/%E9%BC%A0%E9%BC%A0%EF%BC%81Rat%EF%BC%81%E8%A7%84%E5%88%99.js
// ==/UserScript==

//set&sn设置名片
const therat = {
    "name":"rat",
    "fullname":"鼠鼠！Rat!",
    "authors": ["bug人@"],
    "version": "1.0.0",
    "updatedTime": "20240906",
    "templateVer": "1.0",

    "nameTemplate":{
        "rat":{
            "template":"{$t玩家_RAW}|本能{本能}|天意{天意}",
            "helpText": "自动设置鼠鼠！名片"
        }
    },

    "attrConfig":{
        //stshow置顶内容
        "top":['本能', '天意'],
        "sortBy":"name",
        "ignores":[],
        "showAs":{
             "本能":"{本能}","天意":"{天意}"
        },
        "setter":null,
    },


    "setConfig":{
        "diceSides": 6,
        "enableTip": "已切换至6面骰，并自动开启鼠鼠！规则。详情通过.rat help查看。",
        "keys": ["rat"],
        "relatedExt": ["rat","coc7"],
    },

    "defaults":{
        "本能":7,"天意":2
    },
    "defaultsComputed":{
    },
    "alias":{
      "本能": ["本能"],
      "天意": ["天意"]
    },

    "textMap": {
        "trpg-test": {
            "设置测试_成功": [
                ["设置完成", 1]
            ]
        }
    },
    "textMapHelpInfo": null
}
try {
    seal.gameSystem.newTemplate(JSON.stringify(therat))
} catch (e) {
    // 如果扩展已存在，或加载失败，那么会走到这里
    console.log(e)
}

//骰点部分
var exti=seal.ext.find('Rat!');
if (!seal.ext.find('Rat!')){
    //检查扩展不存在
    exti=seal.ext.new('Rat!','bug人@','1.0.0');//建立新扩展
    seal.ext.register(exti);
}
let cmdrt =seal.ext.newCmdItemInfo();
cmdrt.name='rat';//指令名
cmdrt.help='使用帮助：\n.rat(类型)<骰数>//类型不填为正常情况\n类型：诅咒、双重诅咒；祝福、双重祝福';//帮助内容
cmdrt.solve=(ctx,msg,cmdArgs)=>{
    cmdArgs.chopPrefixToArgsWith("诅咒")
    cmdArgs.chopPrefixToArgsWith("祝福")
    cmdArgs.chopPrefixToArgsWith("双重诅咒")
    cmdArgs.chopPrefixToArgsWith("双重祝福")
    let name=seal.format(ctx,"{$t玩家}");
    switch(cmdArgs.getArgN(1)){
        case"help":{
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }
        //双重祝福
        case"双重祝福":{
            switch(cmdArgs.getArgN(2)){
                default:{
                let arg2 =cmdArgs.getArgN(2);
                let pools = Number(arg2);
                let times=0;
                let times2=0;
                let result=[];
                let result2=[];
                let suc=0;
                let fail=0;
                let boom=0;
                while (times<pools){
                    //进行多轮骰点并判定计算
                    var dice = Number(seal.format(ctx, '{d6}'));
                    result.push(dice);times+=1;
                    if (dice==6){
                        boom+=1;suc+=1;
                    }
                    else if (dice==5||dice==4)
                        {
                        suc+=1; 
                        }
                    else if (dice==1)
                    {
                        fail+=1;
                    }
                };
                console.log(boom)
                if (boom!=0){
                    while (times2<boom){
                    var dice = Number(seal.format(ctx, '{d6}'));
                    result2.push(dice);times2+=1;
                    if (dice>=5){
                        suc+=1;
                    }
                    else if (dice==1)
                    {
                        fail+=1;
                    }
                };
                };
                seal.replyToSender(ctx,msg,`${name}进行了${pools}次掷骰，结果为：[${result},${result2}]，成功${suc}次`);
                return seal.ext.newCmdExecuteResult(true);    
            }
            }
        }
        //祝福
        case"祝福":{
            switch(cmdArgs.getArgN(2)){
                default:{
                let arg2 =cmdArgs.getArgN(2);
                let pools = Number(arg2);
                let times=0;
                let result=[];
                let suc=0;
                let fail=0;
                while (times<pools){
                    //进行多轮骰点并判定计算
                    var dice = Number(seal.format(ctx, '{d6}'));
                    result.push(dice);times+=1;
                    if (dice>=4){
                        suc+=1;
                    }
                    else if (dice==1)
                    {
                        fail+=1;
                    }
                };
                seal.replyToSender(ctx,msg,`${name}进行了${pools}次掷骰，结果为：[${result}]，成功${suc}次`);
                return seal.ext.newCmdExecuteResult(true);    
            }
            }
        }
        //诅咒
        case"诅咒":{
            switch(cmdArgs.getArgN(2)){
                default:{
                let arg2 =cmdArgs.getArgN(2);
                let pools = Number(arg2);
                let times=0;
                let result=[];
                let suc=0;
                let fail=0;
                while (times<pools){
                //进行多轮骰点并判定计算
                    var dice = Number(seal.format(ctx, '{d6}'));
                    result.push(dice);times+=1;
                        if (dice==6){
                        suc+=1;
                        }
                        else if (dice==1)
                        {
                        fail+=1;
                        }
                };
                seal.replyToSender(ctx,msg,`${name}进行了${pools}次掷骰，结果为：[${result}]，成功${suc}次`);
                return seal.ext.newCmdExecuteResult(true);    
            }
            }
        }
        //双重诅咒
        case"双重诅咒":{
            switch(cmdArgs.getArgN(2)){
                default:{
                let arg2 =cmdArgs.getArgN(2);
                let pools = Number(arg2);
                let times=0;
                let result=[];
                let suc=0;
                let fail=0;
                while (times<pools){
                //进行多轮骰点并判定计算
                    var dice = Number(seal.format(ctx, '{d6}'));
                    result.push(dice);times+=1;
                        if (dice==6){
                        suc+=1;
                        }
                        else if (dice==1)
                        {
                        fail+=1;suc -= 1;
                        }
                };
                if(suc<0){
                    suc=0
                };
                seal.replyToSender(ctx,msg,`${name}进行了${pools}次掷骰，结果为：[${result}]，成功${suc}次，失败${fail}次（已自动扣除成功数）`);
                return seal.ext.newCmdExecuteResult(true);    
            }
            }
        }
        //无爆炸掷骰
        default:{
            let arg1 =cmdArgs.getArgN(1);
            let pools = Number(arg1)
            let times=0;
            let result=[];
            let suc=0;
            let fail=0;
            while (times<pools){
                //进行多轮骰点并判定计算
                var dice = Number(seal.format(ctx, '{d6}'));
                result.push(dice);times+=1;
                if (dice>=5){
                    suc+=1;
                }
                else if (dice==1)
                {
                    fail+=1;
                }
            };
            seal.replyToSender(ctx,msg,`${name}进行了${pools}次掷骰，结果为：[${result}]，成功${suc}次`);
            return seal.ext.newCmdExecuteResult(true);
        }
    }
};
// 将命令注册到扩展中
exti.cmdMap['rat'] = cmdrt;
