// ==UserScript==
// @name         求道TRPG角色卡
// @author       bug人@
// @version      1.0.0
// @description  使用.qd help 查看详情
// @license      MIT
// @timestamp    2024-4-24
// @homepageURL  https://github.com/bugtower100/bug-repository
// ==/UserScript==

const theqd = {
    "name": "求道TRPG",
    "fullname": "求道TRPG默认卡制作",
    "authors": ["bug人@"],
    "version": "1.0.0",
    "updatedTime": "2024",
    "templateVer": "1.0",
    //写名片
    "nameTemplate": {
        "qd": {
            "template": "{$t玩家_RAW} HP{HP} DEX{灵敏}",
            "helpText": "自动设置求道TRPG名片"
        }
    },

    "attrConfig": {
        //stshow置顶内容
        "top": ['力量', '体质', '灵敏', '感知', '悟性', '意志', '气运', '生命值', '速度值', '灵力池', 'HP', 'PP', 'DB', 'ADB'],
        "sortBy": "name",
        "ignores": ["力气", "体质", "灵敏", "感知"],
        "showAs": {
        },
        "setter": null,
    },

    "setConfig": {
        "diceSides": 100,
        "enableTip": "已切换至100面骰，开启求道TRPG规则扩展",
        "keys": ["qd"],
        "relatedExt": ["求道TRPG默认卡", "coc7"],
    },
    //这里为卡上默认技能
    "defaults": {
        "侦查": 25, "知觉": 10, "洞察": 5, "估价": 15, "猎秘": 25,
        "伪装": 1, "隐匿": 10, "游说": 15, "威胁": 15, "术法": 5,
        "阵法": 5, "符箓": 5, "医术": 1, "毒术": 1, "器物操纵": 10,
        "演奏": 5, "刚类武技": 5, "柔类武技": 5, "射击武技": 5, "通识": 25,
        "知识-典籍": 5, "知识-药理": 5, "知识-乐理": 5, "知识-风俗": 5, "知识-天文": 5,
        "知识-矿物": 5, "知识-植物": 5, "知识-秘文": 5, "知识-易理": 5, "知识-风水": 5,
        "知识-历史": 5, "古代语言-人类": 1, "古代语言-兽灵": 1, "古代语言-物精": 1, "制造-锻造": 5,
        "制造-炼药": 5, "制造-绘符": 5, "制造-纺织": 5, "技艺": 1
    },
    "defaultsComputed": {
        "速度值": "灵敏+感知",
        "语言": "力量*2 + 体质*2 + 悟性*4",
        "闪避": "灵敏*2",
    },
    "alias": {
        "力量": ["str", "STR"], "体质": ["con", "CON"], "体型": ["SIZ", "SIZ"],
        "智力": ["INT", "INT"], "意志": ["pow", "POW"], "敏捷": ["DEX", "dex"],
        "外貌": ["APP", "APP"], "气运": ["LUC", "luc", "幸运"],
        "HP": ["hp", "生命值", "HP"], "PP": ["pp"], "DB": ["db"], "MOV": ["mov", "移动力"], "ADB": ["adb"],

    },
    //这好像是一个总结
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
    seal.gameSystem.newTemplate(JSON.stringify(theqd))
} catch (e) {
    // 如果扩展已存在，或加载失败，那么会走到这里
    console.log(e)
}

var ext = seal.ext.find('qd');
if (!seal.ext.find('qd')) {
    // 创建一个插件
    ext = seal.ext.new('qd', 'bug人@', '1.0.0');
    seal.ext.register(ext);
}

const cmdqd = seal.ext.newCmdItemInfo();
cmdqd.name = 'qd';
cmdqd.help = '使用指南：\n.set qd//开启求道TRPG拓展\n.sn qd//自动设置求道群名片\n.qd<数目>//求道人物卡作成\n.qds<数目>//求道兽灵人物卡作成';
cmdqd.solve = (ctx, msg, cmdArgs) => {
    cmdArgs.chopPrefixToArgsWith("s")
    let val = cmdArgs.getArgN(1) || 1
    switch (val) {
        case "help": {
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret;
        }
        case "s": {
            let twice = cmdArgs.getArgN(2) || 1
            switch (twice) {
                default: {
                    let times = parseInt(twice)
                    let result = seal.format(ctx, "{$t玩家_RAW}的求道人物（兽灵）作成：\n")
                    let split = seal.formatTmpl(ctx, "COC:制卡_分隔符")
                    if (!parseInt(twice) || parseInt(twice) == 0) {
                        const ret = seal.ext.newCmdExecuteResult(true);
                        ret.showHelp = true;
                        return ret;
                    }
                    if (times > 10) {
                        result += "制卡次数过多，请输入不大于10的数字"
                        seal.replyToSender(ctx, msg, result)
                        return seal.ext.newCmdExecuteResult(true);
                    }
                    for (let i = 0; i < times; i++) {
                        let ret = seal.format(ctx,
                            "力量:{$t力=3d6} 体质:{$t体=2d6+6}\n" +
                            "灵敏:{$t敏=3d6} 感知:{$t知=3d6}\n" +
                            "悟性:{$t悟=2d6+6} 意志:{$t意=2d6+6}\n" +
                            "气运:{$t幸=3d6}\n生命值:{$tpp=$t体*2+20}\n" +
                            "灵力池：{$t灵=$t力*2+$t体*2+$t悟*4}\n" +
                            "速度值：{$t速=$t敏+$t知}\n" +
                            "属性总和（不含气运）：{$t属性1=$t力+$t体+$t敏+$t知+$t悟+$t意}\n" +
                            "属性总和：{$t属性2=$t力+$t体+$t敏+$t知+$t悟+$t意+$t幸}"
                        )
                        result = result + ret + split
                    }
                    seal.vars.strSet(ctx, "$t制卡结果文本", result)
                    seal.replyToSender(ctx, msg, result)
                }
                return seal.ext.newCmdExecuteResult(true);
            }


        }
        default: {
            let times = parseInt(val)
            let result = seal.format(ctx, "{$t玩家_RAW}的求道人物作成：\n")
            let split = seal.formatTmpl(ctx, "COC:制卡_分隔符")
            if (!parseInt(val) || parseInt(val) == 0) {
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
                return ret;
            }
            if (times > 10) {
                result += "制卡次数过多，请输入不大于10的数字"
                seal.replyToSender(ctx, msg, result)
                return seal.ext.newCmdExecuteResult(true);
            }
            for (let i = 0; i < times; i++) {
                let ret = seal.format(ctx,
                    "力量:{$t力=3d6} 体质:{$t体=3d6}\n" +
                    "灵敏:{$t敏=3d6} 感知:{$t知=3d6}\n" +
                    "悟性:{$t悟=2d6+6} 意志:{$t意=2d6+6}\n" +
                    "气运:{$t幸=3d6}\n生命值:{$tpp=$t体*2+20}\n" +
                    "灵力池：{$t灵=$t力*2+$t体*2+$t悟*4}\n" +
                    "速度值：{$t速=$t敏+$t知}\n" +
                    "属性总和（不含气运）：{$t属性1=$t力+$t体+$t敏+$t知+$t悟+$t意}\n" +
                    "属性总和：{$t属性2=$t力+$t体+$t敏+$t知+$t悟+$t意+$t幸}"
                )
                result = result + ret + split
            }

            seal.vars.strSet(ctx, "$t制卡结果文本", result)
            seal.replyToSender(ctx, msg, result)
        }
    }
    return seal.ext.newCmdExecuteResult(true);
}

ext.cmdMap['qd'] = cmdqd;