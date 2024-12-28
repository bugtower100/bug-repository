// ==UserScript==
// @name         豚系无限检定指令
// @author       bug人@
// @version      1.0.0
// @description  豚系无限检定指令,使用 .ts help 查看详情，支持骰数和可选参数
// @timestamp    1672423909
// @license      MIT
// @homepageURL  https://github.com/bugtower100/bug-repository/tree/main/js
// ==/UserScript==

// 检查扩展是否已存在
if (!seal.ext.find('豚系无限检定指令')) {
  const ext = seal.ext.new('豚系无限检定指令', 'bug人@', '1.0.0');

  // === .ts 指令 ===
  const cmdTs = seal.ext.newCmdItemInfo();
  cmdTs.name = 'ts';
  cmdTs.help = '豚系无限检定指令使用指南：\n\n.ts <骰数> [p<精准值> cs<提升次数> jt<加骰> ny<难以提升> qy<取优>]\n\n使用例：.ts10 p5 cs2 jt1 ny2 qy2\n\n其中[]内为可选值，不填为默认值（见下方）\n默认精准值：5\n提升次数：1\n加骰：0\n难以提升：1\n取优：1';
  cmdTs.solve = (ctx, msg, cmdArgs) => {
    let name = seal.format(ctx, "{$t玩家}");
    if (cmdArgs.getArgN(1) == 'help') {
      const ret = seal.ext.newCmdExecuteResult(true);
      ret.showHelp = true;
      return ret;
    }
    else {
      // 获取骰数
      const argArr = []
      const argStr = cmdArgs.cleanArgs
      // let key = ''
      let isValue = false
      let tempKey = '',
        tempValue = '',
        argMap = {}
      for (let i = 0; i < argStr.length; i++) {
        if (/\d/.test(argStr[i])) {
          isValue = true
          tempValue += argStr[i]
        } else {
          if (isValue) {
            argMap[tempKey.trim()] = parseInt(tempValue)
            tempValue = ''
            tempKey = ''
          }
          isValue = false
          tempKey += argStr[i]
        }
      }
      argMap[tempKey.trim()] = parseInt(tempValue)
      console.log(JSON.stringify(argMap))
      const diceCount = argMap['']
      // parseInt(cmdArgs.getArgN(1), 10); // 骰数

      // 校验骰数是否合法
      if (isNaN(diceCount) || diceCount <= 0) {
        seal.replyToSender(ctx, msg, '骰数必须为正整数');
        return seal.ext.newCmdExecuteResult(true);
      }

      // 解析可选参数
      let precision = argMap['p'] || 5; // 精准值，默认为 5
      let cs = argMap['cs'] || 1; // 提升次数，默认为 1
      let jt = argMap['jt'] || 0; // 加骰，默认为 0
      let ny = argMap['ny'] || 1; // 难以提升，默认为 1
      let qy = argMap['qy'] || 1; // 取优，默认为 1

      // for (let i = 2; i < cmdArgs.args.length; i++) {
      //   const arg = cmdArgs.getArgN(i);
      //   if (arg.startsWith('cs')) {
      //     cs = parseInt(arg.slice(2), 10) || cs;
      //   } else if (arg.startsWith('jt')) {
      //     jt = parseInt(arg.slice(2), 10) || jt;
      //   } else if (arg.startsWith('ny')) {
      //     ny = parseInt(arg.slice(2), 10) || ny;
      //   } else if (arg.startsWith('qy')) {
      //     qy = parseInt(arg.slice(2), 10) || qy;
      //   }
      // }

      // 初始化统计变量
      let successCount = 0; // 成功数
      let criticalSuccessCount = 0; // 大成功数
      let failureCount = 0; // 失败数
      let resultroll = [];

      // 生成随机数并判断结果
      for (let i = 0; i < diceCount; i++) {
        const roll = Math.floor(Math.random() * 10) + 1; // 生成 1-10 的随机数
        resultroll.push(roll);
        if (roll >= precision) {
          successCount++;
        }
        if (roll === 10) {
          criticalSuccessCount++;
        }
        if (roll === 1) {
          failureCount++;
        }
      }

      // 返回检定结果
      const result = `${name}进行了${diceCount}次检定，结果为：
  [${resultroll}]
  ————————————
  - 成功数: ${successCount}
  - 大成功数: ${criticalSuccessCount}
  - 失败数: ${failureCount}
  ————————————
  - 精准值:${precision}
  - 提升次数: ${cs}
  - 加骰: ${jt}
  - 难以提升: ${ny}
  - 取优: ${qy}`;
      seal.replyToSender(ctx, msg, result);

      return seal.ext.newCmdExecuteResult(true);
    }
  };

  // 注册指令
  ext.cmdMap['ts'] = cmdTs;

  // 注册扩展
  seal.ext.register(ext);
}
