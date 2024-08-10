// ==UserScript==
// @name         永夜后日谈战斗规则及人物做成
// @author       bug人@
// @version      1.0.0
// @description  永夜后日谈战斗轮检定，改编自游鲤的《永夜后日谈战斗规则2.0》，按照个人喜好修正了格式并增加了存在奖励骰的情况\n使用.rnc help查看说明
// @timestamp    20240710
// @diceRequireVer 1.0.0
// @license      Apache-2
// @homepageURL  https://github.com/sealdice/javascript
// ==/UserScript==


var exti=seal.ext.find('Nechronica');
if (!seal.ext.find('Nechronica')){
    //检查扩展不存在
    exti=seal.ext.new('Nechronica','bug人@','1.0.0');//建立新扩展
    seal.ext.register(exti);
}

//制卡部分
const cmddolls = seal.ext.newCmdItemInfo();
cmddolls.name = '人偶作成';
cmddolls.solve = (ctx, msg, cmdArgs) => {
    let val = cmdArgs.getArgN(1)||1
    switch (val) {
        default: {
            let times = parseInt(val)
            let result = seal.format(ctx,"{$t玩家_RAW}的人偶作成如下:\n")
            let split = seal.formatTmpl(ctx, "COC:制卡_分隔符")
            if (!parseInt(val) || parseInt(val) == 0) {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            if (times >= 5) {
                result += "制卡次数过多，请输入不大于5的数字"
                seal.replyToSender(ctx, msg, result)
                return seal.ext.newCmdExecuteResult(true);
            }
            for (let i = 0; i < times; i++) {
                let ret = seal.format(ctx,`#{DRAW-人偶作成}`)
                result = result + ret + split
            }

            seal.vars.strSet(ctx, "$t制卡结果文本", result)
            seal.replyToSender(ctx, msg, result)
        }
    }
    return seal.ext.newCmdExecuteResult(true);
}

//判定部分
let cmdnc =seal.ext.newCmdItemInfo();
cmdnc.name='rnc';//指令名
cmdnc.help='使用说明：\n.人偶作成<数字>//进行人偶背景生成，一次最多5个\n.rnc(修正值) (投掷次数)\n//进行检定，注意指令格式\n//修正值不填默认为0\n//投掷次数建议仅用于含奖励骰的地方，默认为1\n';//帮助内容

cmdnc.solve=(ctx,msg,cmdArgs)=>{
    let name=seal.format(ctx,"{$t玩家}");
    switch(cmdArgs.getArgN(1)){
        case"":{    
                //checkit
                var dice = Number(seal.format(ctx, '{d10}'));
                //投掷一个10面骰        

                if (dice <= 1) {
                seal.replyToSender(ctx,msg,`${name}进行攻击判定：d10=${dice}（大失败）`)
                        return seal.ext.newCmdExecuteResult(true);}
                //12为大成功
                else if(dice <= 5){
                seal.replyToSender(ctx,msg,`${name}进行攻击判定：d10=${dice}（失败）`)
                        return seal.ext.newCmdExecuteResult(true);
                }
                else if (dice == 6){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：d10=${dice}(成功)，命中自选部位`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (dice == 7){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：d10=${dice}(成功)，命中足部`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (dice == 8){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：d10=${dice}(成功)，命中躯干`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (dice == 9){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：d10=${dice}(成功)，命中手臂`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (dice == 10){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：d10=${dice}(成功)，命中头部`)
                    return seal.ext.newCmdExecuteResult(true);
                }                
                else{
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：d10=${dice}(大成功)`)
                    return seal.ext.newCmdExecuteResult(true)
            }
        
    }
        case"help":{
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }

    //第一个参数为为空或者help时进行一层判定

    default:{
        //判断第二个参数
        switch(cmdArgs.getArgN(2)){
            //第二个参数为空时，默认投掷点数为1
            case "":{
                let judge=Number(seal.format(ctx,cmdArgs.getArgN(1)));//获取修正值      
                //checkit
                var dice = Number(seal.format(ctx, '{d10}'));
                //投掷一个10面骰        
                let attribute0=0;//奖励骰数目为0

                let result=dice+judge

                if (result <= 1) {
                seal.replyToSender(ctx,msg,`${name}进行攻击判定：${dice}+${judge}=${result}（大失败）`)
                        return seal.ext.newCmdExecuteResult(true);}
                //12为大成功
                else if(result <= 5){
                seal.replyToSender(ctx,msg,`${name}进行攻击判定：${dice}+${judge}=${result}（失败）`)
                        return seal.ext.newCmdExecuteResult(true);
                }
                else if (result == 6){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：${dice}+${judge}=${result}(成功)，命中自选部位`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result == 7){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：${dice}+${judge}=${result}(成功)，命中足部`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result == 8){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：${dice}+${judge}=${result}(成功)，命中躯干`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result == 9){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：${dice}+${judge}=${result}(成功)，命中手臂`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result == 10){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：${dice}+${judge}=${result}(成功)，命中头部`)
                    return seal.ext.newCmdExecuteResult(true);
                }                
                else{
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：${dice}+${judge}=${result}(大成功)`)
                    return seal.ext.newCmdExecuteResult(true)
            }
        }
            //第二个参数不为空时，进行判定
            default:{
                let judge=Number(seal.format(ctx,cmdArgs.getArgN(1)));//获取判定值
                let attribute0=Number(seal.format(ctx,cmdArgs.getArgN(2)));//获取奖励骰数目
                let pool=0+attribute0;
                let times=0;
                let result=[];let suc=0;let bigsuc=0;
                while (times<pool){
                    //进行多轮骰点并判定计算
                    var dice = Number(seal.format(ctx, '{d10}'));
                    num=dice+judge
                    result.push(num);times+=1;
                    if (num>=6){
                        suc+=1;
                    }
                    else if (num==11)
                    {
                        bigsuc+=1;
                    }
                };
                if (bigsuc>=1){
                    seal.replyToSender(ctx,msg,`${name}进行了${pool}次修正值为${judge}的骰点，结果为[${result}]（大成功）`);//自动加经验
                    return seal.ext.newCmdExecuteResult(true);}
                else if (bigsuc==0&&suc>=1){
                    seal.replyToSender(ctx,msg,`${name}进行了${pool}次修正值为${judge}的骰点，结果为[${result}]（成功）\n请自行判断击中部位`);
                    return seal.ext.newCmdExecuteResult(true);}
                else{
                    seal.replyToSender(ctx,msg,`${name}进行了${pool}次修正值为${judge}的骰点，结果为[${result}]（失败）`);
                return seal.ext.newCmdExecuteResult(true);}
                
                }
            }
        }
    }
};
// 将命令注册到扩展中
exti.cmdMap['rnc'] = cmdnc;
exti.cmdMap['人偶作成'] = cmddolls;
