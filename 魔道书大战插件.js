// ==UserScript==
// @name         魔导书大战
// @author       bug人@
// @version      1.0.0
// @description  能和剑世界2.5共存的魔道书，实现比较粗糙暴力，需要配合魔道书插件用牌堆使用。具体请用.mg help查看说明 
// @timestamp    1723256105
// @diceRequireVer 1.0.0
// @license      Apache-2
// @homepageURL  https://github.com/sealdice/javascript
// ==/UserScript==

var ext=seal.ext.find('Magiclogic');
if (!seal.ext.find('Magiclogic')){
    //检查扩展不存在
    ext=seal.ext.new('Magiclogic','bug人@','1.0.0');//建立新扩展
    seal.ext.register(ext);
}

let cmdmg =seal.ext.newCmdItemInfo();
cmdmg.name='mg';//指令名
cmdmg.help='魔道书大战骰点，格式为 .mg <式子>，式子写法如下:\n\n・判定\n.mgh<目标值>\n可以判定大成功／大失败／成功／失败，并提示生成魔素\n\n・魔道书人物快捷制成\n.mg人物卡<数目>//小于5的数字\n\n・各种表\n经历表　BGT/初期锚点表　DAT/命运属性表　FAT\n愿望表　WIT/战利品表　PT\n时间流逝表　TPT/大判时间流逝表　TPTB\n事件表　AT/大失败表　FT／变调表　WT\n\n命运转变表表　FCT\　典型性灾厄 TCT／物理性灾厄 PCT／精神性灾厄 MCT／狂气性灾厄 ICT\n　社会性灾厄 SCT／超自然灾厄 XCT／不可思议的灾厄 WCT／喜剧性灾厄 CCT\n　魔法使的灾厄 MGCT\n\n场景表　ST／大判场景表　STB\n　极限环境 XEST／内心世界 IWST／魔法都市 MCST\n　死后世界 WDST／迷宫世界 LWST\n　魔法书架 MBST／魔法学院 MAST／克雷德塔 TCST\n　平行世界 PWST／终末世界 PAST／异世界酒吧 GBST\n　星影 SLST／旧图书馆 OLST\n世界法则追加表 WLAT/徘徊怪物表 WMT\n\n随机领域表　RCT\n随机特技表　RTT\n　星领域随机特技表  RTS, RTT1\n　兽领域随机特技表  RTB, RTT2\n　力领域随机特技表  RTF, RTT3\n　歌领域随机特技表  RTP, RTT4\n　梦领域随机特技表  RTD, RTT5\n　暗领域随机特技表  RTN, RTT6\n\n空白秘密表　BST\n　宿敌表　MIT/谋略表　MOT/因缘表　MAT\n　奇人表　MUT/力场表　MFT/同盟表　MLT\n\n落花表　FFT\n那之后表 FLT';//帮助内容

cmdmg.solve=(ctx,msg,cmdArgs)=>{
    cmdArgs.chopPrefixToArgsWith("h")
    cmdArgs.chopPrefixToArgsWith("人物卡")
    let name=seal.format(ctx,"{$t玩家}");
    switch(cmdArgs.getArgN(1)){
        case"BGT":{
            let BGT =seal.format(ctx,`#{DRAW-经历表}`)
            seal.replyToSender(ctx,msg,`经历表：${BGT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"DAT":{
            let DAT =seal.format(ctx,`#{DRAW-初期锚点表}`)
            seal.replyToSender(ctx,msg,`初期锚点表：\n${DAT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"FAT":{
            let FAT =seal.format(ctx,`#{DRAW-命运属性表}`)
            seal.replyToSender(ctx,msg,`命运属性表：\n${FAT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"WIT":{
            let WIT =seal.format(ctx,`#{DRAW-愿望表}`)
            seal.replyToSender(ctx,msg,`愿望表：\n${WIT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"PT":{
            let PT =seal.format(ctx,`#{DRAW-战利品表}`)
            seal.replyToSender(ctx,msg,`战利品表：\n${PT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"TPT":{
            let TPT =seal.format(ctx,`#{DRAW-时间流逝表}`)
            seal.replyToSender(ctx,msg,`时间流逝表：\n${TPT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"TPTB":{
            let TPTB =seal.format(ctx,`#{DRAW-大判时间流逝表}`)
            seal.replyToSender(ctx,msg,`大判时间流逝表：\n${TPTB}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"AT":{
            let AT =seal.format(ctx,`#{DRAW-事件表}`)
            seal.replyToSender(ctx,msg,`事件表：\n${AT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"FT":{
            let FT =seal.format(ctx,`#{DRAW-大失败表}`)
            seal.replyToSender(ctx,msg,`大失败表：\n${FT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"WT":{
            let WT =seal.format(ctx,`#{DRAW-变调表}`)
            seal.replyToSender(ctx,msg,`变调表：\n${WT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"FCT":{
            let FCT =seal.format(ctx,`#{DRAW-命运转变表}`)
            seal.replyToSender(ctx,msg,`命运转变表：\n${FCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"TCT":{
            let TCT =seal.format(ctx,`#{DRAW-典型性灾厄}`)
            seal.replyToSender(ctx,msg,`典型性灾厄：${TCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"PCT":{
            let PCT =seal.format(ctx,`#{DRAW-物理性灾厄}`)
            seal.replyToSender(ctx,msg,`物理性灾厄：${PCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MCT":{
            let MCT =seal.format(ctx,`#{DRAW-精神性灾厄}`)
            seal.replyToSender(ctx,msg,`精神性灾厄：${MCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"ICT":{
            let ICT =seal.format(ctx,`#{DRAW-狂气性灾厄}`)
            seal.replyToSender(ctx,msg,`狂气性灾厄：${ICT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"SCT":{
            let SCT =seal.format(ctx,`#{DRAW-社会性灾厄}`)
            seal.replyToSender(ctx,msg,`社会性灾厄：${SCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"XCT":{
            let XCT =seal.format(ctx,`#{DRAW-超自然灾厄}`)
            seal.replyToSender(ctx,msg,`超自然灾厄：${XCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"WCT":{
            let WCT =seal.format(ctx,`#{DRAW-不可思议的灾厄}`)
            seal.replyToSender(ctx,msg,`不可思议的灾厄：${WCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"CCT":{
            let CCT =seal.format(ctx,`#{DRAW-喜剧性灾厄 }`)
            seal.replyToSender(ctx,msg,`喜剧性灾厄：${CCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MGCT":{
            let MGCT =seal.format(ctx,`#{DRAW-魔法使的灾厄}`)
            seal.replyToSender(ctx,msg,`魔法使的灾厄：${MGCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"ST":{
            let ST =seal.format(ctx,`#{DRAW-场景表}`)
            seal.replyToSender(ctx,msg,`场景表：\n${ST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"STB":{
            let STB =seal.format(ctx,`#{DRAW-大判场景表}`)
            seal.replyToSender(ctx,msg,`大判场景表：\n${STB}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"XEST":{
            let XEST =seal.format(ctx,`#{DRAW-极限环境}`)
            seal.replyToSender(ctx,msg,`极限环境：\n${XEST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"IWST":{
            let IWST =seal.format(ctx,`#{DRAW-内心世界}`)
            seal.replyToSender(ctx,msg,`内心世界：\n${IWST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MCST":{
            let MCST =seal.format(ctx,`#{DRAW-魔法都市}`)
            seal.replyToSender(ctx,msg,`魔法都市：\n${MCST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"WDST":{
            let WDST =seal.format(ctx,`#{DRAW-死后世界}`)
            seal.replyToSender(ctx,msg,`死后世界：\n${WDST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"LWST":{
            let LWST =seal.format(ctx,`#{DRAW-迷宫世界}`)
            seal.replyToSender(ctx,msg,`迷宫世界：\n${LWST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MBST":{
            let MBST =seal.format(ctx,`#{DRAW-魔法书架}`)
            seal.replyToSender(ctx,msg,`魔法书架：\n${MBST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MAST":{
            let MAST =seal.format(ctx,`#{DRAW-魔法学院}`)
            seal.replyToSender(ctx,msg,`魔法学院：\n${MAST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"TCST":{
            let TCST =seal.format(ctx,`#{DRAW-克雷德塔}`)
            seal.replyToSender(ctx,msg,`克雷德塔：\n${TCST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"PWST":{
            let PWST =seal.format(ctx,`#{DRAW-平行世界}`)
            seal.replyToSender(ctx,msg,`平行世界：\n${PWST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"PAST":{
            let PAST =seal.format(ctx,`#{DRAW-终末世界}`)
            seal.replyToSender(ctx,msg,`终末世界：\n${PAST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"GBST":{
            let GBST =seal.format(ctx,`#{DRAW-异世界酒吧}`)
            seal.replyToSender(ctx,msg,`异世界酒吧：\n${GBST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"SLST":{
            let SLST =seal.format(ctx,`#{DRAW-星影}`)
            seal.replyToSender(ctx,msg,`星影：\n${SLST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"OLST":{
            let OLST =seal.format(ctx,`#{DRAW-旧图书馆}`)
            seal.replyToSender(ctx,msg,`旧图书馆：\n${OLST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"WLAT":{
            let WLAT =seal.format(ctx,`#{DRAW-世界法则追加表}`)
            seal.replyToSender(ctx,msg,`世界法则追加表：\n${WLAT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"WMT":{
            let WMT =seal.format(ctx,`#{DRAW-徘徊怪物表}`)
            seal.replyToSender(ctx,msg,`徘徊怪物表：\n${WMT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RCT":{
            let RCT =seal.format(ctx,`#{DRAW-随机领域表}`)
            seal.replyToSender(ctx,msg,`随机领域表：${RCT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT":{
            let RTT =seal.format(ctx,`#{DRAW-特技表}`)
            seal.replyToSender(ctx,msg,`随机特技表 ${RTT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTS":{
            let RTS =seal.format(ctx,`#{DRAW-星领域随机特技表}`)
            seal.replyToSender(ctx,msg,`星领域随机特技表：${RTS}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT1":{
            let RTT1 =seal.format(ctx,`#{DRAW-星领域随机特技表}`)
            seal.replyToSender(ctx,msg,`星领域随机特技表：${RTT1}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTB":{
            let RTB =seal.format(ctx,`#{DRAW-兽领域随机特技表}`)
            seal.replyToSender(ctx,msg,`兽领域随机特技表：${RTB}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT2":{
            let RTT2 =seal.format(ctx,`#{DRAW-兽领域随机特技表}`)
            seal.replyToSender(ctx,msg,`兽领域随机特技表：${RTT2}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTF":{
            let RTF =seal.format(ctx,`#{DRAW-力领域随机特技表}`)
            seal.replyToSender(ctx,msg,`力领域随机特技表：${RTF}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT3":{
            let RTT3 =seal.format(ctx,`#{DRAW-力领域随机特技表}`)
            seal.replyToSender(ctx,msg,`力领域随机特技表：${RTT3}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTP":{
            let RTP =seal.format(ctx,`#{DRAW-歌领域随机特技表}`)
            seal.replyToSender(ctx,msg,`歌领域随机特技表：${RTP}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT4":{
            let RTT4 =seal.format(ctx,`#{DRAW-歌领域随机特技表}`)
            seal.replyToSender(ctx,msg,`歌领域随机特技表：${RTT4}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTP":{
            let RTP =seal.format(ctx,`#{DRAW-梦领域随机特技表}`)
            seal.replyToSender(ctx,msg,`梦领域随机特技表：${RTP}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT4":{
            let RTT4 =seal.format(ctx,`#{DRAW-梦领域随机特技表}`)
            seal.replyToSender(ctx,msg,`梦领域随机特技表：${RTT4}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTD":{
            let RTD =seal.format(ctx,`#{DRAW-梦领域随机特技表}`)
            seal.replyToSender(ctx,msg,`梦领域随机特技表：${RTD}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT5":{
            let RTT5 =seal.format(ctx,`#{DRAW-梦领域随机特技表}`)
            seal.replyToSender(ctx,msg,`梦领域随机特技表：${RTT5}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTN":{
            let RTN =seal.format(ctx,`#{DRAW-暗领域随机特技表}`)
            seal.replyToSender(ctx,msg,`暗领域随机特技表：${RTN}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"RTT6":{
            let RTT6 =seal.format(ctx,`#{DRAW-暗领域随机特技表}`)
            seal.replyToSender(ctx,msg,`暗领域随机特技表：${RTT6}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"BST":{
            let BST =seal.format(ctx,`#{DRAW-空白秘密表}`)
            seal.replyToSender(ctx,msg,`空白秘密表：\n${BST}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MIT":{
            let MIT =seal.format(ctx,`#{DRAW-宿敌表}`)
            seal.replyToSender(ctx,msg,`宿敌表：${MIT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MOT":{
            let MOT =seal.format(ctx,`#{DRAW-谋略表}`)
            seal.replyToSender(ctx,msg,`谋略表：${MOT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MAT":{
            let MAT =seal.format(ctx,`#{DRAW-因缘表}`)
            seal.replyToSender(ctx,msg,`因缘表：${MAT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MUT":{
            let MUT =seal.format(ctx,`#{DRAW-奇人表}`)
            seal.replyToSender(ctx,msg,`奇人表：${MUT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MFT":{
            let MFT =seal.format(ctx,`#{DRAW-力场表}`)
            seal.replyToSender(ctx,msg,`力场表：${MFT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"MLT":{
            let MLT =seal.format(ctx,`#{DRAW-同盟表}`)
            seal.replyToSender(ctx,msg,`同盟表：${MLT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"FFT":{
            let FFT =seal.format(ctx,`#{DRAW-落花表}`)
            seal.replyToSender(ctx,msg,`落花表：${FFT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"FLT":{
            let FLT =seal.format(ctx,`#{DRAW-那之后表}`)
            seal.replyToSender(ctx,msg,`那之后表：\n${FLT}`)
            return seal.ext.newCmdExecuteResult(true)
        }
        case"h":{
            switch(cmdArgs.getArgN(2)){
                default:{
                //checkit
                var target = Number(cmdArgs.getArgN(2))
                var dice1 = Number(seal.format(ctx,'{d6}'));
                var dice2 = Number(seal.format(ctx,'{d6}'));
                //投掷两个6骰        
                var result = dice1 + dice2
                if (cmdArgs.getArgN(2) == 'elp'){
                    const ret = seal.ext.newCmdExecuteResult(true);
                    ret.showHelp = true;
                }
                else if (!Number.isInteger(target)) {  
                    seal.replyToSender(ctx,msg,`执行失败，请检查你的式子`)
                    return seal.ext.newCmdExecuteResult(true);
                }                
                else if (result >= target && dice1 != dice2) {
                seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]>=${target}（成功）`)
                        return seal.ext.newCmdExecuteResult(true);}
                //无魔素产生的成功
                else if(result < target && dice1 != dice2){
                seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]<${target}（失败）`)
                        return seal.ext.newCmdExecuteResult(true);
                }
                //无魔素失败
                else if (result >= target && dice1 == dice2 && dice1== 6){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]（大成功）\n回复1D6点魔力或恢复1种变调\n产生2个暗魔素`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result < target && dice1 == dice2 && dice1== 6){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]（大成功）\n回复1D6点魔力或恢复1种变调\n产生2个暗魔素`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result >= target&& dice1 == dice2 && dice1== 5){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]>=${target}（成功）\n产生2个梦魔素`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result < target && dice1 == dice2 && dice1== 5){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]<${target}（失败）\n产生2个梦魔素`)
                    return seal.ext.newCmdExecuteResult(true);
                }                
                else if (result >= target && dice1 == dice2 && dice1== 4){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]>=${target}（成功）\n产生2个歌魔素`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result < target && dice1 == dice2 && dice1== 4){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]<${target}（失败）\n产生2个歌魔素`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (result >= target && dice1 == dice2 && dice1== 3){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]>=${target}（成功）\n产生2个力魔素`)
                    return seal.ext.newCmdExecuteResult(true);  
                } 
                else if (result < target && dice1 == dice2 && dice1== 3){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]<${target}（失败）\n产生2个力魔素`)
                    return seal.ext.newCmdExecuteResult(true);  
                }   
                else if (result >= target && dice1 == dice2 && dice1== 2){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]>=${target}（成功）\n产生2个兽魔素`)
                    return seal.ext.newCmdExecuteResult(true);  
                } 
                else if (result < target && dice1 == dice2 && dice1== 2){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]<${target}（失败）\n产生2个兽魔素`)
                    return seal.ext.newCmdExecuteResult(true);  
                }     
                else if (result >= target && dice1 == dice2 && dice1== 1){
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]（大失败）\n产生2个星魔素`)
                    return seal.ext.newCmdExecuteResult(true);  
                }    
                else {
                    seal.replyToSender(ctx,msg,`${name}掷出的结果为：2d6=${result}[${dice1},${dice2}]（大失败）\n产生2个星魔素`)
                    return seal.ext.newCmdExecuteResult(true)
                }
                }
            }
        }
        case"人物卡":{              
            switch (cmdArgs.getArgN(2)) {
                default: {
                    let val = cmdArgs.getArgN(2)||1
                    let times = parseInt(val)
                    let result = seal.format(ctx,"")
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
                        let ret = seal.format(ctx,`#{DRAW-魔道书PC生成}`)
                        result = result + ret + split
                    }
    
                    seal.vars.strSet(ctx, "$t制卡结果文本", result)
                    seal.replyToSender(ctx, msg, result)
                    return seal.ext.newCmdExecuteResult(true)
            }
        }
    } 
        
        default:{
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }     
    }
};
ext.cmdMap['mg'] = cmdmg;
