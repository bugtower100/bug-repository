// ==UserScript==
// @name         模式切换开关
// @author       bug人@
// @version      1.0.0
// @description  双开关！
// @timestamp    1728054462
// @license      MIT
// @homepageURL  https://github.com/bugtower100/bug-repository
// ==/UserScript==
if (!seal.ext.find("纯净模式")) {
    const ext = seal.ext.new("纯净模式", "bug人", "1.0.0");
    seal.ext.register(ext);
    const cmdswitch = seal.ext.newCmdItemInfo()
    cmdswitch.name = "纯净模式";
    cmdswitch.help = "■使用前需要了解的：\n纯净模式：给一些需要话少骰子和需要纯净log用户准备的模式\n猫猫模式：给想摸摸猫的用户（夹带私货）准备的模式\n\n■使用帮助：\n.纯净模式（开/开启/关/关闭）\n.simple on/off（这个也是纯净模式的指令）\n.猫猫模式（开/开启/关/关闭）\n.当前模式/.当前模式查询// 显示当前状态\n\n＊该指令replyoff后也可使用";
    //help的在这里（有混子）
    cmdswitch.solve = (ctx, msg, cmdArgs) => {
        let val = cmdArgs.getArgN(1);
        switch (val) {
            case "help"||"帮助":{
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
            return ret;        
            }
        default: {
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret; 
        }
        case "开":
        case "开启":
        case"on":{
            seal.vars.intSet(ctx, `$g简易开关`, 1);
            //变量是你自己设置的那个变量，后面的数字就是自定义里写的那个=多少的值
            seal.replyToSender(ctx, msg, `Che, ne me laisse pas parler n'est - ce pas... Humain méchant!`);
            //here is 回复词
            return seal.ext.newCmdExecuteResult(true);
        }
        case "关":
        case"关闭":
        case"off":{
            seal.vars.intSet(ctx, `$g简易开关`, 0);
            seal.replyToSender(ctx, msg, `嗯嗯～终于舒服咯，这样才对嘛~`);
            return seal.ext.newCmdExecuteResult(true);; 
        }
    }
}
ext.cmdMap['纯净模式'] = cmdswitch;
ext.cmdMap['simple'] = cmdswitch;
//在这里改指令名，虽然应该不用说（混个注释罢了）
}
//需要其他模式直接复制下来改关键词就可以了ww，比如下面这个猫猫模式（指—）
//cmdxx啥的不用改，但是注册的名字要改（就是下面两行）
if (!seal.ext.find("猫猫模式")) {
    const ext = seal.ext.new("猫猫模式", "bug人", "1.0.0");
    seal.ext.register(ext);
    const cmdswitch = seal.ext.newCmdItemInfo()
    cmdswitch.name = "猫猫模式";
    cmdswitch.help = "■使用前需要了解的：\n纯净模式：给一些需要话少骰子和需要纯净log用户准备的模式\n猫猫模式：给想摸摸猫的用户（夹带私货）准备的模式\n\n■使用帮助：\n.纯净模式（开/开启/关/关闭）\n.simple on/off（这个也是纯净模式的指令）\n.猫猫模式（开/开启/关/关闭）\n.当前模式/.当前模式查询// 显示当前状态\n\n＊该指令replyoff后也可使用";
    cmdswitch.solve = (ctx, msg, cmdArgs) => {
        let val = cmdArgs.getArgN(1);
        switch (val) {
            case "help":
            case "帮助":{
                const ret = seal.ext.newCmdExecuteResult(true);
                ret.showHelp = true;
            return ret;        
            }
        default: {
            const ret = seal.ext.newCmdExecuteResult(true);
            ret.showHelp = true;
            return ret; 
        }
        case "开":
        case "开启":{
            seal.vars.intSet(ctx, `$g简易开关`, 2);
            //变量是你自己设置的那个变量，后面的数字就是自定义里写的那个=多少的值
            seal.replyToSender(ctx, msg, `“？！喵？”#你看到手中拿着骰子的神突然变成了一只猫猫，骰子则安稳地躺在祂的身上`);
            //here is 回复词
            return seal.ext.newCmdExecuteResult(true);
        }
        case "关":
        case"关闭":{
            seal.vars.intSet(ctx, `$g简易开关`, 0);
            seal.replyToSender(ctx, msg, `“唔...总算变回来了......”#空中的长毛猫猫又变回了人形，对方揉了揉脑袋小声抱怨着，“真是的，被看到这幅样子，我也不能放过你了啊...”祂迅速靠近了你然后弹了一下你的脑门，你失去了意识......`);
            return seal.ext.newCmdExecuteResult(true); 
        }
    }
}
ext.cmdMap['猫猫模式'] = cmdswitch;
}
if (!seal.ext.find("当前模式")) {
    const ext = seal.ext.new("当前模式", "bug人", "1.0.0");
    seal.ext.register(ext);
    const cmdswitch = seal.ext.newCmdItemInfo()
    cmdswitch.name = "当前模式";
    cmdswitch.solve = (ctx, msg, cmdArgs) => {
        let val = cmdArgs.getArgN(1);
        switch (val) {
            case"":
                {
                    let check = seal.vars.intGet(ctx, `$g简易开关`)
                    //这里也是改对应变量名就行
                    //如果有多个变量就设置多个名字就行，什么check1啊check2啊啥的都行
                    let mode = check[0]
                    //这是上面读取数组的第一个值，也就是变量对应的数字
                    console.log("接收到的参数:", mode);
                    //懒得删了，不用管
                    if (mode == 1){
                        seal.replyToSender(ctx, msg, `.......（是说不出话的简易模式呢）`);
                        return seal.ext.newCmdExecuteResult(true); 
                    }
                    if (mode == 2){
                        seal.replyToSender(ctx, msg, `“喵呜——”脚边的猫猫拖着长音扒拉了你一下\n（是猫猫模式呢）`);
                        return seal.ext.newCmdExecuteResult(true); 
                    }
                    else{
                        seal.replyToSender(ctx, msg, `“在东张西望些什么呢人类~是在找什么东西吗？”耳边响起了轻快柔和的问候声\n（当前为默认模式）`);
                        return seal.ext.newCmdExecuteResult(true); 
                    }
                }   
         }
    }
    ext.cmdMap['当前模式'] = cmdswitch;
    ext.cmdMap['当前模式查询'] = cmdswitch;    
}
if (!seal.ext.find("模式帮助")) {
    const ext = seal.ext.new("模式帮助", "bug人", "1.0.0");
    seal.ext.register(ext);
    const cmdswitch = seal.ext.newCmdItemInfo()
    cmdswitch.name = "其他模式帮助";
    cmdswitch.solve = (ctx, msg, cmdArgs) => {
        let val = cmdArgs.getArgN(1);
        switch (val) {
            case"":
                {
                    seal.replyToSender(ctx, msg, `■使用前需要了解的：\n纯净模式：给一些需要话少骰子和需要纯净log用户准备的模式\n猫猫模式：给想摸摸猫的用户（夹带私货）准备的模式\n\n■使用帮助：\n.纯净模式（开/开启/关/关闭）\n.simple on/off（这个也是纯净模式的指令）\n.猫猫模式（开/开启/关/关闭）\n.当前模式/.当前模式查询// 显示当前状态\n\n＊该指令replyoff后也可使用`);
                    return seal.ext.newCmdExecuteResult(true);  
                }
            }
        }
        ext.cmdMap['其他模式'] = cmdswitch;
        ext.cmdMap['其他模式帮助'] = cmdswitch; 
}
//别问我为什么些这个，因为我是喂饭大王，生怕用户看不到help的东西（哭了）
