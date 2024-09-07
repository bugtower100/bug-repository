// ==UserScript==
// @name         武术规则【成龙历险记TRPG】
// @author       bug人@
// @version      1.0.0
// @description  成龙历险记TRPG规则掷骰辅助，使用.ws help或.rws help查看帮助
// @timestamp    20240708
// @diceRequireVer 1.0.0
// @license      Apache-2
// @homepageURL  https://github.com/bugtower100/bug-repository/
// ==/UserScript==

// 首先检查是否已经存在
var exti = seal.ext.find('wushu');
if (!seal.ext.find('wushu')) {
    //检查扩展不存在
    exti = seal.ext.new('wushu', 'bug人@', '1.0.0');//建立新扩展
    seal.ext.register(exti);
}

//快速行动部分
let cmdwsq = seal.ext.newCmdItemInfo();
cmdwsq.name = 'rws';//指令名
cmdwsq.help = '使用帮助：\n.rws（次数）//快速行动（次数）\n·例如：.rws3 \n//进行了三次快速行动判定\n\n.ws（次数）[等级]//进行决议\n·例如：.ws3[3]\n//进行了3次等级为3的决议判定\n\n.ws阴（次数）阳（次数）[等级]//进行攻击/防守判定\n·例如：.ws阴2阳1[3]\n//进行了2次等级3的防守和1次等级3的攻击判定\n//不攻击或不防守写为“.ws阴1阳0/.ws阴0阳1”\n\n*请注意等级不写默认为2，[等级]的方括号不可忽略';//帮助内容

cmdwsq.solve = (ctx, msg, cmdArgs) => {
    let name = seal.format(ctx, "{$t玩家}");
    switch (cmdArgs.getArgN(1)) {
        case "": {
            //checkit
            var dice = Number(seal.format(ctx, '{d6}'));
            //投掷一个6面骰        

            if (dice == 1) {
                seal.replyToSender(ctx, msg, `${name}快速行动：d6=${dice}\n一个可怕到无法理解的失败`)
                return seal.ext.newCmdExecuteResult(true);
            }
            else if (dice == 2) {
                seal.replyToSender(ctx, msg, `${name}快速行动：d6=${dice}\n一个非常糟糕，或许会令人尴尬的失败`)
                return seal.ext.newCmdExecuteResult(true);
            }
            else if (dice == 3) {
                seal.replyToSender(ctx, msg, `${name}快速行动：d6=${dice}\n一次经典老套的失败`)
                return seal.ext.newCmdExecuteResult(true);
            }
            else if (dice == 4) {
                seal.replyToSender(ctx, msg, `${name}快速行动：d6=${dice}\n一个带有负面影响的成功`)
                return seal.ext.newCmdExecuteResult(true);
            }
            else if (dice == 5) {
                seal.replyToSender(ctx, msg, `${name}快速行动：d6=${dice}\n一个良好的成功，任务勉强完成`)
                return seal.ext.newCmdExecuteResult(true);
            }
            else {
                seal.replyToSender(ctx, msg, `${name}快速行动：d6=${dice}\n一次可靠且水平高超的成功，干得漂亮！`)
                return seal.ext.newCmdExecuteResult(true)
            }
        }
        case "help": {
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }

        default: {
            let check = cmdArgs.getArgN(1);
            let pools = Number(check);//获取掷骰数目
            if (!isNaN(check) && check !== "") {
                let pool = 0 + pools;
                let times = 0;
                let result = [];
                let maxDice = 0; // 用于存储最大骰点值

                while (times < pool) {
                    //进行多轮骰点并判定计算
                    var dice = Number(seal.format(ctx, '{d6}'));
                    result.push(dice); times += 1;
                    if (dice > maxDice) {
                        maxDice = dice;
                    }
                };
                if (maxDice == 1) {
                    seal.replyToSender(ctx, msg, `${name}快速行动${pool}次：d6=[${result}]\n一个可怕到无法理解的失败`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (maxDice == 2) {
                    seal.replyToSender(ctx, msg, `${name}快速行动${pool}次：d6=[${result}]\n一个非常糟糕，或许会令人尴尬的失败`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (maxDice == 3) {
                    seal.replyToSender(ctx, msg, `${name}快速行动${pool}次：d6=[${result}]\n一次经典老套的失败`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (maxDice == 4) {
                    seal.replyToSender(ctx, msg, `${name}快速行动${pool}次：d6=[${result}]\n一个带有负面影响的成功`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else if (maxDice == 5) {
                    seal.replyToSender(ctx, msg, `${name}快速行动${pool}次：d6=[${result}]\n一个良好的成功，任务勉强完成`)
                    return seal.ext.newCmdExecuteResult(true);
                }
                else {
                    seal.replyToSender(ctx, msg, `${name}快速行动${pool}次：d6=[${result}]\n一次可靠且水平高超的成功，干得漂亮！`)
                    return seal.ext.newCmdExecuteResult(true)
                }
            }
            else {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
        }
    }
};


/**
 * 松子：因为我正则并不擅长，也不擅长JS，所以只能出此下策。正常情况下，应该匹配括号内的内容变成数字，这种方案是直接替换了所有括号。
 * 处理传入的字符串，移除中括号并转换为数字
 * @param {string} input - 传入的字符串
 * @returns {number} - 转换后的数字
 */
function processString(input) {
    // 移除左中括号和右中括号
    const cleaned = input.replace(/\[|\]/g, '');
    
    // 将剩下的字符串转换为数字
    const result = Number(cleaned);
    
    // 检查转换结果是否为有效的数字
    if (isNaN(result)) {
        throw new Error('转换后的结果不是有效的数字');
    }
    
    return result;
}



//决策和战斗部分
let cmdws = seal.ext.newCmdItemInfo();
cmdws.name = 'ws';//指令名
cmdws.help = '使用帮助：\n.rws（次数）//快速行动（次数）\n·例如：.rws3 \n//进行了三次快速行动判定\n\n.ws（次数）[等级]//进行决议\n·例如：.ws3[3]\n//进行了3次等级为3的决议判定\n\n.ws阴（次数）阳（次数）[等级]//进行攻击/防守判定\n·例如：.ws阴2阳1[3]\n//进行了2次等级3的防守和1次等级3的攻击判定\n//不攻击或不防守写为“.ws阴1阳0/.ws阴0阳1”\n\n*请注意等级不写默认为2，[等级]的方括号不可忽略';//帮助内容
cmdws.solve = (ctx, msg, cmdArgs) => {
    // 获取玩家名字
    let name = seal.format(ctx, "{$t玩家}");
    let arg1 = cmdArgs.getArgN(1);

    // 定义正则表达式
    const isNumber = /^\d+$/; // 纯数字
    // 将数字部分放在一个捕获组内，避免获取到括号
    const isCheckNumber = /^\[(\d+)\]$/;// [数字]
    const isNumberNumber = /^(\d+)\[(\d+)\]$/; // 数字[数字]
    const isYinYang = /^阴(\d+)阳(\d+)$/; // 阴数字阳数字
    const isYinYangWithOptionalDigit = /^阴(\d+)阳(\d+)\[(\d+)\]$/; // 阴数字阳数字[数字]
    const isYinYangOnlyWithOptionalDigit = /^阴阳\[(\d+)\]$/; // 阴阳[数字]
    const isYinYangOnly = /^阴阳$/; // 仅阴阳
    const isHelp = /^help$/; // help命令

    console.log("接收到的参数:", arg1);

    // 匹配输入参数
    let matchNumber = isNumber.test(arg1);
    let matchCheckNumber = isCheckNumber.exec(arg1);
    let matchNumberNumber = isNumberNumber.exec(arg1);
    let matchYinYang = isYinYang.exec(arg1);
    let matchYinYangWithOptionalDigit = isYinYangWithOptionalDigit.exec(arg1);
    let matchYinYangOnly = isYinYangOnly.test(arg1);
    let matchYinYangOnlyWithOptionalDigit = isYinYangOnlyWithOptionalDigit.exec(arg1);
    let matchHelp = isHelp.test(arg1);

    switch (true) {
        // .ws 检定 (默认一个d6)
        case arg1 === "": {
            console.log("执行空参数检定");
            let dice = Number(seal.format(ctx, '{d6}'));
            console.log("投掷结果:", dice);
            let result = dice > 2 ? "不中" : "中";
            seal.replyToSender(ctx, msg, `${name}的武术检定：d6=${dice}/2（${result}）`);
            return seal.ext.newCmdExecuteResult(true);
        }
        // .ws (次数) 检定
        case matchNumber: {
            console.log("执行次数检定, 次数:", arg1);
            let pools = Number(arg1);
            let results = [];
            let successes = 0;
            let times = 0

            for (let i = 0; i < pools; i++) {
                let dice = Number(seal.format(ctx, '{d6}'));
                console.log(`第${times + 1}次投掷结果:`, dice);
                results.push(dice);
                if (dice <= 2) successes++;
            }
            console.log("最终投掷结果:", results);
            seal.replyToSender(ctx, msg, `${name}的武术检定：d6=[${results}]，中${successes}次`);
            return seal.ext.newCmdExecuteResult(true);
        }
        // .ws [等级] 检定
        case matchCheckNumber!=null: {
            // 这里因为带着括号，所以不能直接转换成等级的喵……理论上应该修改正则表达式
            console.log("执行[等级]检定，等级:", processString(matchCheckNumber[1]));
            let check = processString(matchCheckNumber[1]);
            let dice = Number(seal.format(ctx, '{d6}'));
            let result = dice > check ? "不中" : "中";
            console.log("投掷结果:", dice);

            seal.replyToSender(ctx, msg, `${name}的武术检定：d6=${dice}/${check}（${result}）`);
            return seal.ext.newCmdExecuteResult(true);
        }
        // .ws (次数)[等级] 检定
        case matchNumberNumber!=null: {
            let pools = processString(matchNumberNumber[1]);
            let check = processString(matchNumberNumber[2]);
            console.log("执行(次数)[等级]检定，次数为: " + processString(matchNumberNumber[1]) + "等级:", processString(matchNumberNumber[2]));
            let results = [];
            let successes = 0;

            for (let i = 0; i < pools; i++) {
                let dice = Number(seal.format(ctx, '{d6}'));
                console.log("(次数)[等级] 检定 投掷结果:", dice);
                results.push(dice);
                if (dice <= check) successes++;
            }

            seal.replyToSender(ctx, msg, `${name}的武术检定：d6=[${results}]，中${successes}次`);
            return seal.ext.newCmdExecuteResult(true);
        }
        // .ws 阴x阳y 检定
        case matchYinYang!=null: {
            console.log("执行阴x阳y检定，阴为: " + matchYinYang[1] + "阳为:", matchYinYang[2]);
            let yinCount = processString(matchYinYang[1]);
            let yangCount = processString(matchYinYang[2]);
            

            let yinResults = [];
            let yangResults = [];
            let yinSuccesses = 0;
            let yangSuccesses = 0;

            // 阴检定
            for (let i = 0; i < yinCount; i++) {
                let dice = Number(seal.format(ctx, '{d6}'));
                console.log("阴检定 投掷结果:", dice);
                yinResults.push(dice);
                if (dice <= 2) yinSuccesses++;
            }

            // 阳检定
            for (let i = 0; i < yangCount; i++) {
                let dice = Number(seal.format(ctx, '{d6}'));
                console.log("阳检定 投掷结果:", dice);
                yangResults.push(dice);
                if (dice <= 2) yangSuccesses++;
            }

            let reply = `${name}的武术检定：\n阴[${yinResults}]，中${yinSuccesses}次\n阳[${yangResults}]，中${yangSuccesses}次`;
            seal.replyToSender(ctx, msg, reply);
            return seal.ext.newCmdExecuteResult(true);
        }
        // .ws 阴x阳y[等级] 检定
        case matchYinYangWithOptionalDigit!=null: {
            let yinCount = processString(matchYinYangWithOptionalDigit[1]);
            let yangCount = processString(matchYinYangWithOptionalDigit[2]);
            let check = processString(matchYinYangWithOptionalDigit[3]);

            let yinResults = [];
            let yangResults = [];
            let yinSuccesses = 0;
            let yangSuccesses = 0;

            console.log(`阴阳检定，阴次数: ${yinCount}, 阳次数: ${yangCount}, 等级: ${check}`);

            // 阴检定
            for (let i = 0; i < yinCount; i++) {
                let dice = Number(seal.format(ctx, '{d6}'));
                yinResults.push(dice);
                console.log(`阴第${i + 1}轮结果: d6=${dice}`);
                if (dice <= check) yinSuccesses++;
            }

            // 阳检定
            for (let i = 0; i < yangCount; i++) {
                let dice = Number(seal.format(ctx, '{d6}'));
                yangResults.push(dice);
                console.log(`阳第${i + 1}轮结果: d6=${dice}`);
                if (dice <= check) yangSuccesses++;
            }

            console.log(`阴结果: [${yinResults}], 阴成功次数: ${yinSuccesses}`);
            console.log(`阳结果: [${yangResults}], 阳成功次数: ${yangSuccesses}`);

            let reply = `${name}的武术检定：\n阴[${yinResults}]，中${yinSuccesses}次\n阳[${yangResults}]，中${yangSuccesses}次`;
            seal.replyToSender(ctx, msg, reply);
            return seal.ext.newCmdExecuteResult(true);
        }

        // .ws 阴阳 检定
        case matchYinYangOnly: {
            let diceYin = Number(seal.format(ctx, '{d6}'));
            let diceYang = Number(seal.format(ctx, '{d6}'));

            console.log(`阴阳检定结果: 阴d6=${diceYin}, 阳d6=${diceYang}`);

            let yinResult = diceYin <= 2 ? "阴中1次" : "阴中0次";
            let yangResult = diceYang <= 2 ? "阳中1次" : "阳中0次";

            console.log(`阴结果:d6=${diceYin}/2，${yinResult}\n阳结果:d6=${diceYang}，${yangResult}`);

            let reply = `${name}的武术检定：\n${yinResult}\n${yangResult}`;
            seal.replyToSender(ctx, msg, reply);
            return seal.ext.newCmdExecuteResult(true);
        }

        // .ws 阴阳[等级] 检定
        case matchYinYangOnlyWithOptionalDigit!=null: {
            let check = processString(matchYinYangOnlyWithOptionalDigit[1]);
            let diceYin = Number(seal.format(ctx, '{d6}'));
            let diceYang = Number(seal.format(ctx, '{d6}'));

            console.log(`阴阳检定，等级: ${check}, 阴d6=${diceYin}, 阳d6=${diceYang}`);

            let yinResult = diceYin <= check ? `d6=${diceYin}/${check}，阴中1次` : `d6=${diceYin}/${check}，阴中0次`;
            let yangResult = diceYang <= check ? `d6=${diceYang}/${check}，阳中1次 ` : `d6=${diceYang}/${check}，阳中0次`;

            console.log(`阴结果: ${yinResult}, 阳结果: ${yangResult}`);

            let reply = `${name}的武术检定：\n${yinResult}\n${yangResult}`;
            seal.replyToSender(ctx, msg, reply);
            return seal.ext.newCmdExecuteResult(true);
        }

        // 显示帮助
        case matchHelp:
        default: {
            console.log("显示帮助...")
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }
    }
};
// 将命令注册到扩展中
exti.cmdMap['rws'] = cmdwsq;
exti.cmdMap['ws'] = cmdws;
