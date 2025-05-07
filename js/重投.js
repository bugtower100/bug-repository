// ==UserScript==
// @name         掷骰条件重投
// @author       希望潇洒的风&bug人@
// @version      1.0.0
// @description  根据限制条件进行二次重骰，并非爆炸掷骰。使用.xr help 查看帮助。
// @timestamp    1671368035
// ==/UserScript==

let ext = seal.ext.find('掷骰条件重投');
if (!ext) {
    ext = seal.ext.new('掷骰条件重投', '希望潇洒的风', '1.0.0');
    seal.ext.register(ext);
}

const cmd = seal.ext.newCmdItemInfo();
cmd.name = '掷骰条件重投';
cmd.help = [
    '掷骰条件重投',
    '.xr [判断条件](其他掷骰公式)',
    '——————————————',
    '使用范例：.xr 2d6<3 → 对每个d6进行判断小于3时重投对应骰子',
    '.xr (2d6+1d10)<5 → 每个括号内骰子独立判断',
    '——————————————',
    '实际使用例子：',
    '.xr(2d6+1d10)<5+1d6-1',
    '<User>掷出的结果为：',
    '2d6<5[1→3, 3→3] + 1d10<5[8] + 1d6[1] - 1 = 14',
].join('\n')
cmd.solve = (ctx, msg, cmdArgs) => {
    switch (cmdArgs.args[0]) {
        case undefined:
        case '':
        case 'help': {
            return {
                solved: true,
                showHelp: true
            };
        }
        default: {
            let res;
            try {
                res = DiceParser.parse(cmdArgs.cleanArgs);
                replyThere(`${seal.format(ctx, '{$t玩家}掷出的结果为：\n')}${res.details} = ${res.total}`);
            } catch (e) {
                replyThere(e.message);
            }
            return seal.ext.newCmdExecuteResult(true);
        }
    }
    function replyThere(str) {
        seal.replyToSender(ctx, msg, str);
    }
};
ext.cmdMap['xr'] = cmd;

class DiceParser {
    static parse(expr) {
        try {
            expr = expr.replace(/\s+/g, '').replaceAll('＞', '>').replaceAll('＜', '<');
            const tokens = this.tokenizeExpression(expr);
            return this.evaluateExpression(tokens);
        } catch (err) {
            throw new Error(`解析错误: ${err.message}`);
        }
    }

    static tokenizeExpression(expr) {
        const tokens = [];
        let i = 0;
    
        while (i < expr.length) {
            // 修改点1：重构括号解析逻辑
            if (expr[i] === '(') { // 遇到左括号时
                let j = i + 1;
                let bracketCount = 1;
                let subExpr = '';
                // 提取括号内的子表达式
                while (j < expr.length && bracketCount > 0) {
                    if (expr[j] === '(') bracketCount++;
                    if (expr[j] === ')') bracketCount--;
                    if (bracketCount > 0) subExpr += expr[j];
                    j++;
                }
                if (bracketCount !== 0) throw new Error('括号不匹配');
                i = j; // 跳过已处理的括号内容
    
                // 修改点2：解析括号后的条件（如 <5）
                let condition = null;
                const opRegex = /^(>=|<=|==|>|<)/;
                if (i < expr.length) {
                    const opMatch = expr.slice(i).match(opRegex);
                    if (opMatch) {
                        const operator = opMatch[0];
                        i += operator.length;
                        let valueStr = '';
                        while (i < expr.length && /\d/.test(expr[i])) {
                            valueStr += expr[i];
                            i++;
                        }
                        if (valueStr === '') throw new Error('条件值不能为空');
                        condition = { operator, value: parseInt(valueStr) };
                    }
                }
    
                // 修改点3：递归解析子表达式并附加条件到每个骰子
                const subTokens = this.tokenizeExpression(subExpr);
                subTokens.forEach(t => {
                    if (t.type === 'dice') {
                        // 覆盖骰子原有条件（如将 2d6>3 覆盖为 <5）
                        t.condition = condition; 
                    }
                });
                tokens.push(...subTokens);
                continue; 
            }
    
            // 以下为原有逻辑
            if (/\d/.test(expr[i])) {
                let numStr = '';
                while (i < expr.length && /\d/.test(expr[i])) {
                    numStr += expr[i];
                    i++;
                }
                const num = parseInt(numStr);
    
                if (i < expr.length && (expr[i] === 'd' || expr[i] === 'D')) {
                    i++;
                    let sidesStr = '';
                    while (i < expr.length && /\d/.test(expr[i])) {
                        sidesStr += expr[i];
                        i++;
                    }
                    if (sidesStr === '') throw new Error('骰子面数不能为空');
                    const sides = parseInt(sidesStr);
    
                    // 解析骰子自身条件
                    let condition = null;
                    const opRegex = /^(>=|<=|==|>|<)/;
                    if (i < expr.length) {
                        const opMatch = expr.slice(i).match(opRegex);
                        if (opMatch) {
                            const operator = opMatch[0];
                            i += operator.length;
                            let valueStr = '';
                            while (i < expr.length && /\d/.test(expr[i])) {
                                valueStr += expr[i];
                                i++;
                            }
                            if (valueStr === '') throw new Error('条件值不能为空');
                            condition = { operator, value: parseInt(valueStr) };
                        }
                    }
                    tokens.push({ type: 'dice', count: num, sides, condition });
                } else {
                    tokens.push({ type: 'number', value: num });
                }
            } else if (expr[i] === '+' || expr[i] === '-') {
                tokens.push({ type: 'operator', value: expr[i] });
                i++;
            } else {
                throw new Error(`无法识别的字符: ${expr[i]}`);
            }
        }
        return tokens;
    }

    static rollDice(count, sides, condition) {
        const rolls = [];
        let sum = 0;
        for (let i = 0; i < count; i++) {
            let attempts = [];
            // 第一次投掷
            let result = Math.floor(Math.random() * sides) + 1;
            attempts.push(result);

            // 检查条件，若符合则重投一次（无论第二次结果如何）
            if (condition && this.checkCondition(result, condition.operator, condition.value)) {
                result = Math.floor(Math.random() * sides) + 1;
                attempts.push(result);
            }

            sum += result;
            rolls.push({ attempts, final: result });
        }
        return { sum, rolls };
    }

    static checkCondition(value, operator, target) {
        switch (operator) {
            case '>': return value > target;
            case '<': return value < target;
            case '>=': return value >= target;
            case '<=': return value <= target;
            case '==': return value === target;
            default: throw new Error(`未知运算符: ${operator}`);
        }
    }

    static evaluateExpression(tokens) {
        let total = 0, details = '', currentSign = 1;
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            if (token.type === 'dice') {
                const result = this.rollDice(token.count, token.sides, token.condition);
                total += currentSign * result.sum;
                let diceDesc = `${token.count}d${token.sides}`;
                if (token.condition) diceDesc += `${token.condition.operator}${token.condition.value}`;
                diceDesc += `[${result.rolls.map(r => r.attempts.join('→')).join(', ')}]`;
                details += diceDesc;
            } else if (token.type === 'number') {
                total += currentSign * token.value;
                details += token.value;
            } else if (token.type === 'operator') {
                currentSign = token.value === '+' ? 1 : -1;
                details += ` ${token.value} `;
            } else if (token.type === 'condition') {
                const leftRes = this.parseDice(token.left);
                const rightVal = parseInt(token.right);
                let conditionMet;
                switch (token.operator) {
                    case '>': conditionMet = leftRes.total > rightVal; break;
                    case '<': conditionMet = leftRes.total < rightVal; break;
                    case '>=': conditionMet = leftRes.total >= rightVal; break;
                    case '<=': conditionMet = leftRes.total <= rightVal; break;
                    case '==': conditionMet = leftRes.total === rightVal; break;
                    default: throw new Error(`无效运算符: ${token.operator}`);
                }
                if (conditionMet) {
                    const newRes = this.parseDice(token.left);
                    total += currentSign * newRes.total;
                    details += `(${leftRes.details} ${token.operator} ${rightVal} → ${newRes.details})`;
                } else {
                    total += currentSign * leftRes.total;
                    details += `(${leftRes.details} ${token.operator} ${rightVal})`;
                }
            }
        }
        return { total, details };
    }

    static parseDice(expr) {
        const tokens = this.tokenizeExpression(expr);
        return this.evaluateExpression(tokens);
    }
}