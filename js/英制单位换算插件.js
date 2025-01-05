// ==UserScript==
// @name         英制单位换算插件
// @author       bug人@
// @version      1.0.0
// @description  支持长度、重量、体积和温度的单位换算
// @timestamp    2025-01-15
// @license      MIT
// @homepageURL  https://github.com/bugtower100/bug-repository
// ==/UserScript==

if (!seal.ext.find('unit-convert')) {
  const ext = seal.ext.new('unit-convert', 'bug人@', '1.0.0');

  // 定义单位换算关系
  const unitConversions = {
    // 长度
    'ft': { to: 'm', factor: 0.3048 }, // 英尺 -> 米
    'm': { to: 'ft', factor: 3.28084 }, // 米 -> 英尺
    'in': { to: 'cm', factor: 2.54 }, // 英寸 -> 厘米
    'cm': { to: 'in', factor: 0.393701 }, // 厘米 -> 英寸

    // 重量
    'lb': { to: 'kg', factor: 0.453592 }, // 磅 -> 千克
    'kg': { to: 'lb', factor: 2.20462 }, // 千克 -> 磅

    // 体积
    'gal': { to: 'L', factor: 3.78541 }, // 加仑 -> 升
    'L': { to: 'gal', factor: 0.264172 }, // 升 -> 加仑

    // 温度
    'f': { to: 'c', formula: (val) => (val - 32) * (5 / 9) }, // 华氏度 -> 摄氏度
    'c': { to: 'f', formula: (val) => (val * 9 / 5) + 32 }, // 摄氏度 -> 华氏度
  };

  // 帮助信息
  const helpText = `单位换算

使用 .convert <数值> <单位> 进行英制与公制单位换算，支持长度、重量、体积和温度。
例：.convert 5 ft（将 5 英尺换算为米）或 .convert 32 f（将 32 华氏度换算为摄氏度）。

特别注意的是，单位需为支持的类型，如 ft（英尺）、lb（磅）、m（米）、kg（千克）等。
不支持的单位将返回错误提示。

常见单位对应关系：
长度：ft（英尺）↔ m（米），in（英寸）↔ cm（厘米）
重量：lb（磅）↔ kg（千克）
体积：gal（加仑）↔ L（升）
温度：f（华氏度）↔ c（摄氏度）

输入 .convert help 查看帮助信息。`;

  // 创建命令
  const cmdConvert = seal.ext.newCmdItemInfo();
  cmdConvert.name = 'convert';
  cmdConvert.help = helpText;

  cmdConvert.solve = (ctx, msg, cmdArgs) => {
    const val = cmdArgs.getArgN(1); // 获取第一个参数

    // 处理 .convert help
    if (val === 'help') {
      seal.replyToSender(ctx, msg, helpText);
      return seal.ext.newCmdExecuteResult(true);
    }

    const num = parseFloat(val); // 获取数值
    const unit = cmdArgs.getArgN(2); // 获取单位

    if (isNaN(num) || !unit) {
      seal.replyToSender(ctx, msg, '请输入正确的数值和单位，例如：.convert 5 ft ，详情查看.convert help');
      return seal.ext.newCmdExecuteResult(true);
    }

    const conversion = unitConversions[unit.toLowerCase()];
    if (!conversion) {
      seal.replyToSender(ctx, msg, `不支持的单位：${unit}，请检查输入是否正确，或查看.convert help 获取帮助。`);
      return seal.ext.newCmdExecuteResult(true);
    }

    let result;
    if (conversion.formula) {
      // 温度换算使用公式
      result = conversion.formula(num).toFixed(2);
    } else {
      // 其他单位使用系数换算
      result = (num * conversion.factor).toFixed(2);
    }

    seal.replyToSender(ctx, msg, `${num} ${unit} = ${result} ${conversion.to}`);
    return seal.ext.newCmdExecuteResult(true);
  };

  // 注册命令
  ext.cmdMap['convert'] = cmdConvert;

  // 注册扩展
  seal.ext.register(ext);
}
