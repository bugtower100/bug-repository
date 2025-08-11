// ==UserScript==
// @name         狩魂者骰子插件
// @author       bug
// @version      1.0.2
// @description  狩魂者TRPG骰子系统插件，使用.sh help 查看帮助。改编自Desom-fu大佬（121096913）的狩魂者插件，特别鸣谢Desom-fu大佬的无私分享！
// @timestamp    1754370401
// @license      MIT
// @homepageURL  https://github.com/bugtower100/bug-repository
// ==/UserScript==

// 狩魂者游戏系统模板
const shouhunTemplate = {
    "name": "shouhun",
    "fullname": "狩魂者",
    "authors": ["bug"],
    "version": "1.0.2",
    "updatedTime": "20250805",

    "nameTemplate": {
        "sh": {
            "template": "{$t玩家_RAW} HP{HP}/{HPMAX} MP{MP}/{MPMAX} SHM{SHM}/{SHMMAX}",
            "helpText": "自动设置狩魂者名片"
        }
    },
    "defaults": {
        "道具点": 3,
        "运动": 0,
        "操作": 0,
        "隐秘": 0,
        "调查": 0,
        "洞察": 0,
        "说服": 0,
        "狩魂学识": 0
    },

    "defaultsComputed": {
        "武技强度": "体魄/2",
        "术法强度": "智慧/2",
        "灵能力强度": "心魂/2"
    },

    "alias": {
        "HP": ["生命值", "HP", "生命", "体力", "HITPOINTS", "血量", "hp"],
        "HPMAX": ["生命上限", "HPMAX", "生命值上限", "hpmax"],
        "MP": ["灵力值", "MP", "灵力", "魔法", "MAGICPOINTS", "mp"],
        "MPMAX": ["灵力值上限", "MPMAX", "灵力上限", "魔法上限", "MAGICPOINTSMAX", "mpmax"],
        "SHM": ["SHM", "时髦值", "时髦", "shm"],
        "SHMMAX": ["SHMMAX", "时髦值上限", "时髦上限", "shmmax"],
        "EXP": ["经验", "EXP", "exp"],
        "武技强度": ["武技强度", "武技"],
        "术法强度": ["术法强度", "术法"],
        "灵能力强度": ["灵能力强度", "灵能力"],
        "体魄": ["体魄"],
        "智慧": ["智慧"],
        "心魂": ["心魂"],
        "运动": ["运动"],
        "操作": ["操作"],
        "隐秘": ["隐秘"],
        "调查": ["调查", "侦查", "侦察"],
        "洞察": ["洞察", "感知", "心理学"],
        "说服": ["说服"],
        "狩魂学识": ["狩魂学识"],
        "警告符咒": ["警告符咒", "警告"],
        "斗法符咒": ["斗法符咒", "斗法"],
        "斗法符咒二": ["斗法符咒二", "斗法二"],
        "任务符咒": ["任务符咒", "任务"],
        "事件符咒": ["事件符咒", "事件"]
    },

    "attrConfig": {
        "top": ['HP', 'MP', 'SHM', '体质', '智慧', '魂力'],
        "sortBy": "name",
        "ignores": [],
        "showAs": {
            "HP": "{HP}/{HPMAX}",
            "MP": "{MP}/{MPMAX}",
            "SHM": "{SHM}/{SHMMAX}"
        }
    },

    "setConfig": {
        "diceSides": 20,
        "enableTip": "已切换至20面骰，并自动开启狩魂者规则。详情通过.sh help查看。",
        "keys": ["sh", "shouhun", "狩魂者"],
        "relatedExt": ["shouhun", "coc7"]
    }
};

// 注册游戏系统模板
try {
    // 使用正确的方式注册模板
    seal.gameSystem.newTemplate(JSON.stringify(shouhunTemplate));
    console.log('狩魂者模板注册成功');
} catch (e) {
    console.log('狩魂者模板注册失败:', e);
    // 如果是因为已存在而失败，这是正常的
    if (e.message && e.message.includes('已存在')) {
        console.log('狩魂者模板已存在，这是正常的');
    }
}

let ext = seal.ext.find('shouhun');
if (!ext) {
    ext = seal.ext.new('shouhun', 'bug', '1.0.2');
}

// 技能别名映射表 - 与海豹自带属性名称保持一致
const SKILL_ALIASES = {
    // 生命力系统
    '生命值': ['生命值', 'HP', '生命', '体力', '血量', 'hp'],
    '生命值max': ['生命值max', '生命值上限', 'HPMAX', '最大生命值', 'hpmax'],
    '魔力值': ['魔力值', 'MP', '灵力', '法力', 'mp'],
    '魔力值max': ['魔力值max', '魔力值上限', 'MPMAX', '最大魔力值', 'mpmax'],
    '狩魂值': ['狩魂值', 'SHM', '时髦值', 'shm'],
    '狩魂值max': ['狩魂值max', '狩魂值上限', 'SHMMAX', '最大狩魂值', 'shmmax'],

    // 核心属性
    '体质': ['体质', '体魄', 'CON', 'con'],
    '智慧': ['智慧', '智力', 'INT', 'int'],
    '魂力': ['魂力', '心魂', '精神', 'SOU', 'sou'],

    // 衍生属性
    '力量': ['力量', 'STR', 'str'],
    '敏捷': ['敏捷', 'DEX', 'dex'],
    '意志': ['意志', 'WIL', 'wil'],

    // 基础技能
    '格斗': ['格斗', '近战', '武技'],
    '射击': ['射击', '远程', '射术'],
    '潜行': ['潜行', '隐秘', '隐蔽'],
    '运动': ['运动', '体育', '攀爬', '体能'],
    '学识': ['学识', '知识', '狩魂学识'],
    '调查': ['调查', '侦查', '侦察', '搜索'],
    '交涉': ['交涉', '说服', '欺骗', '威吓', '社交'],
    '感知': ['感知', '洞察', 'PER', 'per'],

    // 符咒技能
    '护身符制作': ['护身符制作', '制符', '符咒制作'],
    '护身符激活': ['护身符激活', '激符', '符咒激活'],
    '灵魂感知': ['灵魂感知', '感魂', '灵感'],
    '灵魂操控': ['灵魂操控', '控魂', '操控'],
    '灵魂净化': ['灵魂净化', '净魂', '净化'],

    // 新增属性
    '武技强度': ['武技强度', '武技'],
    '术法强度': ['术法强度', '术法'],
    '灵能力强度': ['灵能力强度', '灵能力'],
    '道具点': ['道具点'],
    '操作': ['操作'],
    '隐秘': ['隐秘'],
    '洞察': ['洞察'],
    '说服': ['说服'],
    '狩魂学识': ['狩魂学识']
};

// 显示名称映射
const DISPLAY_NAMES = {
    'HP': '生命值',
    'HPMAX': '生命值上限',
    'MP': '灵力值',
    'MPMAX': '灵力值上限',
    'SHM': '时髦值',
    'SHMMAX': '时髦值上限'
};

// 获取技能的标准名称
function resolveSkillName(inputName) {
    const upperInput = inputName.toUpperCase();
    for (const [canonicalName, aliases] of Object.entries(SKILL_ALIASES)) {
        if (aliases.some(alias => alias.toUpperCase() === upperInput)) {
            return canonicalName;
        }
    }
    return inputName;
}

// 技能解析函数 - 从海豹角色卡读取属性
function resolveSkill(skillName, ctx) {
    // 直接匹配
    if (SKILL_ALIASES[skillName]) {
        return getAttributeValue(skillName, ctx);
    }

    // 别名匹配
    for (const [mainSkill, aliases] of Object.entries(SKILL_ALIASES)) {
        if (aliases.includes(skillName)) {
            return getAttributeValue(mainSkill, ctx);
        }
    }

    // 如果都没匹配到，尝试直接获取
    const value = getAttributeValue(skillName, ctx);
    return value !== 0 ? value : 0;
}

// 从海豹角色卡获取属性值
function getAttributeValue(attrName, ctx) {
    try {
        // 使用 seal.format 获取属性值，这是正确的方法
        const result = seal.format(ctx, `{${attrName}}`);
        const value = parseInt(result);

        if (!isNaN(value)) {
            return value;
        }

        // 如果解析失败，返回0
        return 0;
    } catch (error) {
        return 0;
    }
}

// 获取显示名称
function getDisplayName(internalName) {
    return DISPLAY_NAMES[internalName] || internalName;
}

// 检查边界是否有效
function isValidBoundary(expression, pos) {
    if (pos >= expression.length) {
        return true; // 字符串结束
    }
    const nextChar = expression[pos];
    return !(/[a-zA-Z\u4e00-\u9fa5]/.test(nextChar)) || nextChar.toUpperCase() === 'D';
}

// 贪婪匹配技能替换
function replaceSkillsGreedy(expression, skillDict, ctx) {
    // 获取所有可能的技能名（包括别名）
    const allSkills = [];
    for (const [canonicalName, aliases] of Object.entries(SKILL_ALIASES)) {
        for (const alias of aliases) {
            allSkills.push({ name: alias, canonical: canonicalName });
        }
    }

    // 按长度降序排序
    allSkills.sort((a, b) => b.name.length - a.name.length);

    let result = "";
    let i = 0;

    while (i < expression.length) {
        let matched = false;

        // 首先尝试直接从角色卡读取属性（优先级最高）
        let attrName = "";
        let j = i;
        while (j < expression.length) {
            const char = expression[j];
            if (/[\u4e00-\u9fa5a-zA-Z0-9]/.test(char)) {
                attrName += char;
                j++;
            } else {
                break;
            }
        }
        
        // 只有当属性名不包含骰子表达式（如"d"字符）且是有效边界时才尝试读取
        if (attrName.length > 0 && !attrName.toLowerCase().includes('d') && isValidBoundary(expression, i + attrName.length)) {
            // 尝试从角色卡直接读取属性值
            const attrValue = seal.format(ctx, `{${attrName}}`);
            const numValue = parseInt(attrValue);
            if (!isNaN(numValue)) {
                result += numValue.toString();
                i += attrName.length;
                matched = true;
            }
        }

        // 如果直接读取失败，再尝试匹配预定义技能
        if (!matched) {
            for (const skill of allSkills) {
                const skillName = skill.name;
                if (expression.substring(i).toUpperCase().startsWith(skillName.toUpperCase())) {
                    const nextPos = i + skillName.length;
                    if (isValidBoundary(expression, nextPos)) {
                        const canonicalName = skill.canonical;
                        const skillValue = skillDict[canonicalName];
                        if (skillValue !== undefined) {
                            result += skillValue.toString();
                            i = nextPos;
                            matched = true;
                            break;
                        }
                    }
                }
            }
        }

        if (!matched) {
            result += expression[i];
            i++;
        }
    }

    return result;
}

// 计算D20特殊效果
function calculateD20Effect(d20Results, isOpponent = false) {
    let effect = 0;

    if (!Array.isArray(d20Results)) {
        return effect;
    }

    for (const result of d20Results) {
        if (result === 20) {
            effect += isOpponent ? -1 : 1; // 自己的20加1，对手的20减1
        } else if (result === 1) {
            effect += isOpponent ? 1 : -1; // 自己的1减1，对手的1加1
        }
    }

    return effect;
}

// 解析骰子表达式并计算结果
function rollDiceExpression(ctx, expression) {
    try {
        const result = seal.format(ctx, `{${expression}}`);
        const match = result.match(/=(\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
        return parseInt(result) || 0;
    } catch (e) {
        return 0;
    }
}

// 获取详细的骰子投掷结果，同时记录D20原始结果
function rollDiceExpressionDetailed(ctx, expression) {
    const d20Results = [];
    
    try {
        // 如果表达式不包含骰子，尝试通过seal.format计算
        if (!expression.includes('d')) {
            try {
                const result = seal.format(ctx, `{${expression}}`);
                const value = parseInt(result) || 0;
                return {
                    detail: `${expression} = ${value}`,
                    value: value,
                    d20Results: []
                };
            } catch (e) {
                const value = parseInt(expression) || 0;
                return {
                    detail: value.toString(),
                    value: value,
                    d20Results: []
                };
            }
        }
        
        // 查找所有骰子表达式，支持多个骰子组合
        const diceRegex = /(\d*)d(\d+)/g;
        const matches = [...expression.matchAll(diceRegex)];
        
        if (matches.length === 0) {
            // 如果没有找到骰子表达式，使用原来的方法
            const result = seal.format(ctx, `{${expression}}`);
            const value = parseInt(result) || 0;
            return {
                detail: value.toString(),
                value: value,
                d20Results: []
            };
        }
        
        let processedExpression = expression;
        let totalValue = 0;
        const diceDetails = [];
        
        // 处理每个骰子表达式
        for (const match of matches) {
            const fullMatch = match[0]; // 完整匹配，如 "3d4"
            const diceCount = parseInt(match[1]) || 1;
            const diceSides = parseInt(match[2]);
            
            // 分别投掷每个骰子
            const diceResults = [];
            let diceSum = 0;
            
            for (let i = 0; i < diceCount; i++) {
                const rollResult = seal.format(ctx, `{1d${diceSides}}`);
                const diceValue = parseInt(rollResult) || 1;
                diceResults.push(diceValue);
                diceSum += diceValue;
                
                // 如果是D20，记录原始结果
                if (diceSides === 20) {
                    d20Results.push(diceValue);
                }
            }
            
            // 构建这组骰子的详细显示
            const diceDetail = `[${diceResults.join('+')}]`;
            diceDetails.push(diceDetail);
            
            // 在表达式中替换骰子为具体数值
            processedExpression = processedExpression.replace(fullMatch, diceSum.toString());
        }
        
        // 计算最终结果（包括修正值）
        const finalResult = seal.format(ctx, `{${processedExpression}}`);
        const finalValue = parseInt(finalResult) || 0;
        
        // 构建完整的详细显示
        let detail;
        if (matches.length === 1 && processedExpression === matches[0][0].replace(matches[0][0], diceDetails[0].slice(1, -1).split('+').reduce((a, b) => parseInt(a) + parseInt(b), 0).toString())) {
            // 单个骰子组且无修正值
            detail = `${diceDetails[0]}=${finalValue}`;
        } else {
            // 多个骰子或有修正值
            let detailExpression = expression;
            for (let i = 0; i < matches.length; i++) {
                detailExpression = detailExpression.replace(matches[i][0], diceDetails[i]);
            }
            detail = `${detailExpression}=${finalValue}`;
        }
        
        return {
            detail: detail,
            value: finalValue,
            d20Results: d20Results
        };
    } catch (e) {
        return {
            detail: expression + ' = 0',
            value: 0,
            d20Results: []
        };
    }
}

// 注意：extractD20Results函数已被移除，现在直接从rollDiceExpressionDetailed获取D20结果

// 狩魂者检定主函数
function performShouhunCheck(ctx, frontExpr, backExpr, modifiers) {
    try {
        // 获取角色技能数据
        const skillDict = {};

        // 从角色卡获取技能值
        for (const [canonicalName] of Object.entries(SKILL_ALIASES)) {
            const value = getAttributeValue(canonicalName, ctx);
            skillDict[canonicalName] = value;

            // 同时为所有别名创建映射
            const aliases = SKILL_ALIASES[canonicalName];
            if (aliases) {
                for (const alias of aliases) {
                    skillDict[alias] = value;
                }
            }
        }
        
        // 技能替换
        const frontResolved = replaceSkillsGreedy(frontExpr, skillDict, ctx);
        const backResolved = replaceSkillsGreedy(backExpr, skillDict, ctx);

        // 直接使用解析后的表达式
        let frontFinal = frontResolved;
        let backFinal = backResolved;
        
        // 计算骰子结果
        const frontRoll = rollDiceExpressionDetailed(ctx, frontFinal);
        const backRoll = rollDiceExpressionDetailed(ctx, backFinal);
        const frontResult = frontRoll.value;
        const backResult = backRoll.value;

        // 获取D20结果用于特殊效果计算
        const frontD20s = frontRoll.d20Results;
        const backD20s = backRoll.d20Results;

        // 计算基础成功等级
        const baseSuccess = Math.max(0, Math.floor((frontResult - backResult + 4) / 5));

        // 计算D20特殊效果
        const frontD20Bonus = calculateD20Effect(frontD20s, false);
        const backD20Bonus = calculateD20Effect(backD20s, true);

        // 计算修正
        let finalSuccess = baseSuccess;
        finalSuccess += modifiers.selfBonus || 0;
        finalSuccess -= modifiers.selfPenalty || 0;
        finalSuccess -= modifiers.opponentBonus || 0;
        finalSuccess += modifiers.opponentPenalty || 0;
        finalSuccess += frontD20Bonus + backD20Bonus;

        // 确保成功等级至少为0
        finalSuccess = Math.max(0, finalSuccess);

        // 构建成功等级计算过程
        const baseSuccessValue = Math.floor((frontResult - backResult + 4) / 5);
        const totalD20Bonus = frontD20Bonus + backD20Bonus;
        
        let successCalculation;
        
        if (totalD20Bonus !== 0) {
            // 有D20特殊效果时的显示格式
            let d20EffectText = '';
            if (frontD20Bonus !== 0) {
                const frontD20Text = frontD20s.includes(20) ? '大成功!' : (frontD20s.includes(1) ? '大失败...' : '');
                d20EffectText += `${frontD20Bonus > 0 ? '+' : ''}${frontD20Bonus}（${frontD20Text}）`;
            }
            if (backD20Bonus !== 0) {
                const backD20Text = backD20s.includes(20) ? '大成功!' : (backD20s.includes(1) ? '大失败...' : '');
                d20EffectText += `${backD20Bonus > 0 ? '+' : ''}${backD20Bonus}（${backD20Text}）`;
            }
            
            successCalculation = `max(0, (${frontResult} - ${backResult} + 4) / 5)${d20EffectText} = max(0, ${baseSuccessValue})${totalD20Bonus > 0 ? '+' : ''}${totalD20Bonus} = ${finalSuccess}`;
        } else {
            // 无D20特殊效果时的简化显示
            successCalculation = `max(0, (${frontResult} - ${backResult} + 4) / 5) = max(0, ${baseSuccessValue}) = ${finalSuccess}`;
        }

        // 添加修正项说明
        let modifierDetails = [];
        if (modifiers.selfBonus) modifierDetails.push(`己方奖励+${modifiers.selfBonus}`);
        if (modifiers.selfPenalty) modifierDetails.push(`己方惩罚-${modifiers.selfPenalty}`);
        if (modifiers.opponentBonus) modifierDetails.push(`对方奖励-${modifiers.opponentBonus}`);
        if (modifiers.opponentPenalty) modifierDetails.push(`对方惩罚+${modifiers.opponentPenalty}`);

        if (frontD20Bonus !== 0) {
            const frontD20Text = frontD20s.includes(20) ? '大成功!' : (frontD20s.includes(1) ? '大失败...' : '');
            modifierDetails.push(`出值D20效果${frontD20Bonus > 0 ? '+' : ''}${frontD20Bonus}(${frontD20Text})`);
        }
        if (backD20Bonus !== 0) {
            const backD20Text = backD20s.includes(20) ? '大成功!' : (backD20s.includes(1) ? '大失败...' : '');
            modifierDetails.push(`挑战值D20效果${backD20Bonus > 0 ? '+' : ''}${backD20Bonus}(${backD20Text})`);
        }

        // 如果有其他修正项（非D20特殊效果），使用详细显示
        const otherModifiers = modifierDetails.filter(detail => !detail.includes('D20效果'));
        if (otherModifiers.length > 0) {
            successCalculation = `出值${frontResult} - 挑战值${backResult} = ${frontResult - backResult}`;
            for (const detail of otherModifiers) {
                successCalculation += ` ${detail.includes('-') ? '' : '+'}${detail.replace(/[+-]/, '')}`;
            }
            // 添加D20特殊效果
            if (totalD20Bonus !== 0) {
                let d20EffectText = '';
                if (frontD20Bonus !== 0) {
                    const frontD20Text = frontD20s.includes(20) ? '大成功!' : (frontD20s.includes(1) ? '大失败...' : '');
                    d20EffectText += ` ${frontD20Bonus > 0 ? '+' : ''}出值D20效果${frontD20Bonus}（${frontD20Text}）`;
                }
                if (backD20Bonus !== 0) {
                    const backD20Text = backD20s.includes(20) ? '大成功!' : (backD20s.includes(1) ? '大失败...' : '');
                    d20EffectText += ` ${backD20Bonus > 0 ? '+' : ''}挑战值D20效果${backD20Bonus}（${backD20Text}）`;
                }
                successCalculation += d20EffectText;
            }
            successCalculation += ` = ${finalSuccess}`;
        }

        const result = {
            frontResult,
            backResult,
            successLevel: finalSuccess,
            isSuccess: frontResult >= backResult,
            frontDetail: frontRoll.detail,
            backDetail: backRoll.detail,
            frontD20s,
            backD20s,
            baseSuccess,
            successCalculation,
            // 添加技能替换信息
            originalFrontExpr: frontExpr,
            originalBackExpr: backExpr,
            resolvedFrontExpr: frontResolved,
            resolvedBackExpr: backResolved,
            finalFrontExpr: frontFinal,
            finalBackExpr: backFinal,
            skillReplacementOccurred: frontExpr !== frontResolved || backExpr !== backResolved
        };
        
        return result;
    } catch (error) {
        throw new Error(`检定计算失败: ${error.message}`);
    }
}

// 创建命令执行结果
function cmdResultRegular() {
    return seal.ext.newCmdExecuteResult(true);
}

function cmdResultHelp() {
    const result = seal.ext.newCmdExecuteResult(true);
    result.showHelp = true;
    return result;
}

// 解析狩魂者指令
function parseShouhunCommand(cmdText) {
    const modifiers = {
        isHidden: false,
        selfBonus: 0,
        selfPenalty: 0,
        opponentBonus: 0,
        opponentPenalty: 0
    };

    let remaining = cmdText;

    // 检测暗骰 - 支持.shh格式（不需要空格）
    if (remaining.startsWith('h')) {
        modifiers.isHidden = true;
        if (remaining.startsWith('h ')) {
            // 有空格的情况：.sh h 体质
            remaining = remaining.substring(2);
        } else if (remaining === 'h') {
            // 只有h的情况：.sh h
            remaining = remaining.substring(1);
        } else {
            // 无空格的情况：.shh体质
            remaining = remaining.substring(1);
        }
    }

    // 解析奖励/惩罚
    const bpMatch = remaining.match(/^([bp])(\d+)/);
    if (bpMatch) {
        const type = bpMatch[1];
        const value = parseInt(bpMatch[2]);
        if (type === 'b') {
            modifiers.selfBonus = value;
        } else {
            modifiers.selfPenalty = value;
        }
        remaining = remaining.substring(bpMatch[0].length).trim();
    }



    // 分离前式和后式
    const parts = remaining.split('#');
    let frontExpr = parts[0].trim() || '1d20';
    let backExpr = parts[1] || '10';

    // 如果前式不包含骰子表达式，自动添加1d20
    if (frontExpr && !frontExpr.includes('d') && !frontExpr.match(/^\d+$/)) {
        frontExpr = '1d20+' + frontExpr;
    }

    // 解析后式的奖励/惩罚
    if (parts[1]) {
        backExpr = backExpr.trim();
        const backBpMatch = backExpr.match(/^([bp])(\d+)\s*(.*)/);
        if (backBpMatch) {
            const type = backBpMatch[1];
            const value = parseInt(backBpMatch[2]);
            if (type === 'b') {
                modifiers.opponentBonus = value;
            } else {
                modifiers.opponentPenalty = value;
            }
            backExpr = backBpMatch[3].trim() || '10';
        }
    }

    // 如果后式不包含骰子表达式且不是纯数字，自动添加1d20
    if (backExpr && !backExpr.includes('d') && !backExpr.match(/^\d+$/)) {
        backExpr = '1d20+' + backExpr;
    }

    return { frontExpr, backExpr, modifiers };
}

// 狩魂者检定指令处理函数
function handleShouhunCheck(mctx, msg, cmdArgs) {
    const cmdText = cmdArgs.getRestArgsFrom(1).trim();

    // 处理help请求
    if (cmdText.toLowerCase() === 'help') {
        return cmdResultHelp();
    }

    // 处理空指令，默认进行1d20对抗挑战值10的检定
    let processedCmdText = cmdText;
    if (!cmdText) {
        processedCmdText = '1d20#10';
    } else {
        // 解析指令以检查是否需要添加默认骰和挑战值
        const tempParsed = parseShouhunCommand(cmdText);
        let frontExpr = tempParsed.frontExpr;
        let backExpr = tempParsed.backExpr;
        
        // 检查前式是否包含d20，如果没有则添加默认骰
        if (!frontExpr.toLowerCase().includes('d20')) {
            if (frontExpr) {
                frontExpr = `1d20+${frontExpr}`;
            } else {
                frontExpr = '1d20';
            }
        }
        
        // 如果没有挑战值，添加默认挑战值10
        if (!backExpr) {
            backExpr = '10';
        }
        
        // 重新构建指令文本
        let modifierText = '';
        if (tempParsed.modifiers.isHidden) modifierText += 'h';
        if (tempParsed.modifiers.selfBonus > 0) modifierText += `b${tempParsed.modifiers.selfBonus}`;
        if (tempParsed.modifiers.selfPenalty > 0) modifierText += `p${tempParsed.modifiers.selfPenalty}`;
        
        processedCmdText = `${modifierText}${frontExpr}#${backExpr}`;
    }

    try {
        const { frontExpr, backExpr, modifiers } = parseShouhunCommand(processedCmdText);
        const result = performShouhunCheck(mctx, frontExpr, backExpr, modifiers);

        // 格式化结果消息
        let replyText = `${seal.format(mctx, '{$t玩家}') || '未知'}进行了命运的掷骰！\n--------------------\n`;
        
        // 格式化骰子表达式显示
        function formatDiceExpression(originalExpr, resolvedExpr, finalExpr, rollResult, rollDetail) {
            // 如果有技能替换，显示完整的替换过程
            if (originalExpr !== resolvedExpr) {
                return `${originalExpr} → ${finalExpr}=${rollResult}[${rollDetail}]`;
            } else {
                // 简化格式：表达式=结果[详细结果]
                return `${finalExpr}=${rollResult}[${rollDetail}]`;
            }
        }
        
        // 显示出值表达式
        replyText += `出值表达式：${formatDiceExpression(result.originalFrontExpr, result.resolvedFrontExpr, result.finalFrontExpr, result.frontResult, result.frontDetail)}\n`;
        
        // 显示挑战值
        replyText += `挑战值：${result.backResult}[${result.backResult}]\n`;
        
        // 分隔线
        replyText += `--------------------\n`;
        
        // 显示成功等级计算
        replyText += `成功等级：${result.successCalculation}\n`;
        
        // 显示结果
        if (result.isSuccess) {
            replyText += `结果：成功等级：${result.successLevel}`;
        } else {
            replyText += `结果：失败`;
        }

        // 调试信息：显示读取到的属性值（已移除，使用 .sh debug 查看详细信息）

        // D20特殊效果已计算在成功等级中，不再单独显示

        // 发送结果
        if (modifiers.isHidden) {
            seal.replyPerson(mctx, msg, replyText);
            seal.replyToSender(mctx, msg, `${seal.format(mctx, '{$t玩家}')} 进行了一次暗骰检定`);
        } else {
            seal.replyToSender(mctx, msg, replyText);
        }

    } catch (error) {
        console.log('狩魂者检定错误:', error);
        seal.replyToSender(mctx, msg, `检定失败：${error.message || '未知错误'}`);
    }

    return cmdResultRegular();
}

// 回复函数简化
function replyToSender(ctx, msg, text) {
    try {
        seal.replyToSender(ctx, msg, text);
    } catch (e) {
        console.log('回复失败:', e);
    }
}

function replyPerson(ctx, msg, text) {
    try {
        seal.replyPerson(ctx, msg, text);
    } catch (e) {
        console.log('私聊回复失败:', e);
    }
}

// 创建狩魂者检定指令
const cmdShouhun = seal.ext.newCmdItemInfo();
cmdShouhun.name = 'sh';
// 启用代骰功能，允许@某人时获取对方数据
cmdShouhun.allowDelegate = true;
cmdShouhun.help = `=== 狩魂者TRPG骰子插件 ===
【角色卡管理】
.set sh/狩魂者 - 切换到狩魂者游戏系统
.sn sh- 更改狩魂者名片

【检定指令】
.sh [参数][表达式][#[参数][表达式]]
.sh @某人 [参数][表达式][#[参数][表达式]] - 代骰功能

【参数说明】
h     - 暗骰，结果私发给投掷者
b数字 - 奖励成功等级（如：b2）
p数字 - 惩罚成功等级（如：p1）
#     - 分隔前式(出值)和后式(挑战值)

【默认骰机制】
• 系统会自动为所有检定添加1d20作为默认骰
• 如果表达式中已包含d20，则不会重复添加
• 没有挑战值时，默认使用挑战值10

【示例】
.sh 调查
  → 自动变为：1d20+调查#10

.sh 体质d4#12
  → 自动变为：1d20+体质d4#12

.sh 3d6+2#15
  → 自动变为：1d20+3d6+2#15

.sh 1d20+调查#15
  → 已包含d20，不会重复添加

.sh b2 运动#p1 体魄
  → 奖励2等级的运动检定，对抗惩罚1等级的体魄

.sh h 说服
  → 暗骰的说服检定

.sh @bug猫 调查
  → 代替张三进行调查技能检定

【成功等级计算】
成功等级 = max(0, (出值 - 挑战值 + 4) / 5)
• D20大成功(20)：额外+1成功等级
• D20大失败(1)：额外-1成功等级
• D20特殊效果已自动计算在最终成功等级中
`;

cmdShouhun.solve = (ctx, msg, cmdArgs) => {
    // 获取代骰数据，支持@某人进行代骰
    const mctx = seal.getCtxProxyFirst(ctx, cmdArgs);
    return handleShouhunCheck(mctx, msg, cmdArgs);
};

// 注册指令
ext.cmdMap['sh'] = cmdShouhun;

// 注释：角色卡设置功能已移除，使用海豹自带的.st指令进行属性录入

// 注册扩展
seal.ext.register(ext);

// 注释：移除了set和sn命令的自定义实现，避免与系统命令冲突
// 狩魂者规则切换应该通过游戏系统模板的setConfig自动处理