// ==UserScript==
// @name         骰子入群致辞阈值(ws版本，内置可用)
// @author       bug人@
// @version      1.0.0
// @description  骰子自己入群时，获取群人数并按阈值发送不同入群致辞，使用前请清空海豹的入群致辞。如需关闭，请在插件设置处进行关闭。\n该插件为付费委托插件公开，感谢程尹，因为他的社恐，让骰主想要做这个插件！
// @timestamp    2026-03-07
// @license      MIT
// @homepageURL  https://github.com/bugtower100/bug-repository
// ==/UserScript==

let ext = seal.ext.find("入群致辞阈值");
if (!ext) {
  ext = seal.ext.new("入群致辞阈值", "bug人@", "1.0.0");
}

try {
  seal.ext.register(ext);
} catch (_) {}

try {
  seal.ext.registerStringConfig(ext, "ws地址", "ws://127.0.0.1:8081");
} catch (_) {}
try {
  seal.ext.registerBoolConfig(ext, "启用", true);
} catch (_) {}
try {
  seal.ext.registerIntConfig(ext, "人数阈值", 10);
} catch (_) {}
try {
  seal.ext.registerStringConfig(ext, "人数较少致辞", "大家好，我来啦！当前群人数{count}");
} catch (_) {}
try {
  seal.ext.registerStringConfig(ext, "人数较多致辞", "大家好，打扰了！当前群人数{count}");
} catch (_) {}

if (ext) {
  function logJoin(...args) {
    try {
      console.log("[骰子入群致辞]", ...args);
    } catch (_) {}
  }

  function normalizeId(val) {
    if (val === null || val === undefined) return "";
    const s = String(val);
    const ms = s.match(/\d+/g);
    if (!ms || ms.length === 0) return s;
    return ms[ms.length - 1];
  }

  function formatText(t, data) {
    return String(t).replace(/\{(\w+)\}/g, (_, k) => {
      if (Object.prototype.hasOwnProperty.call(data, k)) return String(data[k]);
      return `{${k}}`;
    });
  }

  function sleepMs(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  let ws = null;
  let wsUrl = "";
  let connecting = false;
  let openWaiters = [];
  let reconnectTimer = 0;
  let echoSeq = 1;
  const pending = new Map();
  const sendQueue = [];
  const groupQueue = new Map();

  function getWsUrl() {
    try {
      return seal.ext.getStringConfig(ext, "ws地址");
    } catch (_) {
      return "ws://127.0.0.1:8081";
    }
  }

  function enqueueGroup(groupId, fn) {
    const gid = normalizeId(groupId);
    const prev = groupQueue.get(gid) || Promise.resolve();
    const next = prev.then(fn, fn);
    groupQueue.set(gid, next);
    return next;
  }

  function flushSendQueue() {
    while (ws && ws.readyState === 1 && sendQueue.length > 0) {
      ws.send(sendQueue.shift());
    }
  }

  function scheduleReconnect() {
    if (reconnectTimer) return;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = 0;
      connectWs();
    }, 3000);
  }

  function rejectAllPending(reason) {
    for (const [echo, p] of pending.entries()) {
      clearTimeout(p.timer);
      pending.delete(echo);
      try {
        p.reject(new Error(reason));
      } catch (_) {}
    }
  }

  function connectWs() {
    const nextUrl = getWsUrl();
    if (ws && ws.readyState === 1 && wsUrl === nextUrl) return;
    if (connecting) return;
    connecting = true;
    wsUrl = nextUrl;

    try {
      ws = new WebSocket(wsUrl);
    } catch (e) {
      connecting = false;
      rejectAllPending("WebSocket创建失败");
      scheduleReconnect();
      for (const w of openWaiters.splice(0)) w.reject(e);
      return;
    }

    ws.onopen = () => {
      connecting = false;
      flushSendQueue();
      for (const w of openWaiters.splice(0)) w.resolve();
    };

    ws.onmessage = (event) => {
      const raw = event && event.data !== undefined ? event.data : event;
      let obj = null;
      try {
        obj = JSON.parse(raw);
      } catch (_) {
        return;
      }

      if (obj && obj.echo && pending.has(String(obj.echo))) {
        const p = pending.get(String(obj.echo));
        pending.delete(String(obj.echo));
        clearTimeout(p.timer);
        p.resolve(obj);
        return;
      }

      if (
        obj &&
        (obj.post_type === "notice" || obj.postType === "notice") &&
        (obj.notice_type === "group_increase" || obj.noticeType === "group_increase")
      ) {
        const gid = normalizeId(obj.group_id ?? obj.groupId);
        const uid = normalizeId(obj.user_id ?? obj.userId);
        const selfId = normalizeId(obj.self_id ?? obj.selfId);
        if (!gid || !uid || !selfId) return;
        if (uid !== selfId) return;
        onBotJoinedGroup(String(obj.group_id ?? obj.groupId), String(obj.user_id ?? obj.userId), String(obj.self_id ?? obj.selfId));
      }
    };

    ws.onerror = () => {
      connecting = false;
      scheduleReconnect();
    };

    ws.onclose = () => {
      connecting = false;
      ws = null;
      rejectAllPending("WebSocket已断开");
      scheduleReconnect();
      for (const w of openWaiters.splice(0)) w.reject(new Error("WebSocket已断开"));
    };
  }

  function ensureWsOpen() {
    const nextUrl = getWsUrl();
    if (ws && ws.readyState === 1 && wsUrl === nextUrl) return Promise.resolve();
    connectWs();
    return new Promise((resolve, reject) => {
      openWaiters.push({ resolve, reject });
      setTimeout(() => {
        reject(new Error("WebSocket连接超时"));
      }, 8000);
    });
  }

  async function wsCall(action, params) {
    await ensureWsOpen();
    return new Promise((resolve, reject) => {
      const echo = `bjw_${Date.now()}_${echoSeq++}`;
      const payload = JSON.stringify({ action, params, echo });
      const timer = setTimeout(() => {
        pending.delete(echo);
        reject(new Error(`请求超时: ${action}`));
      }, 10000);
      pending.set(echo, { resolve, reject, timer });
      if (ws && ws.readyState === 1) {
        ws.send(payload);
      } else {
        sendQueue.push(payload);
        scheduleReconnect();
      }
    });
  }

  async function getStableGroupInfo(groupIdRaw) {
    const gid = normalizeId(groupIdRaw);
    if (!gid) return null;

    await sleepMs(1500);

    const maxTries = 5;
    const intervalMs = 700;
    let prevCount = null;
    let stable = 0;
    let last = null;

    for (let i = 0; i < maxTries; i++) {
      try {
        const infoResp = await wsCall("get_group_info", { group_id: Number(gid), no_cache: true });
        const data = infoResp && infoResp.data ? infoResp.data : null;
        const count = data && typeof data.member_count === "number" ? data.member_count : null;
        const name = data && data.group_name ? data.group_name : "";
        if (count !== null) {
          last = { count, groupName: name, tries: i + 1 };
          if (prevCount !== null && count === prevCount) stable++;
          else stable = 0;
          prevCount = count;
          if (stable >= 1) return last;
        }
      } catch (_) {}

      await sleepMs(intervalMs);
    }

    return last;
  }

  function pickWelcomeByCount(count) {
    let threshold = 50;
    try {
      threshold = seal.ext.getIntConfig(ext, "人数阈值");
    } catch (_) {
      threshold = 50;
    }
    const isLarge = Number(count) >= Number(threshold);
    try {
      return seal.ext.getStringConfig(ext, isLarge ? "人数较多致辞" : "人数较少致辞") || "";
    } catch (_) {
      return "";
    }
  }

  async function onBotJoinedGroup(groupIdRaw, userIdRaw, selfIdRaw) {
    return enqueueGroup(groupIdRaw, async () => {
      const gid = normalizeId(groupIdRaw);
      const uid = normalizeId(userIdRaw);
      const selfId = normalizeId(selfIdRaw);
      if (!gid || !uid || !selfId) return;
      if (uid !== selfId) return;
      try {
        if (!seal.ext.getBoolConfig(ext, "启用")) return;
      } catch (_) {}

      const info = await getStableGroupInfo(groupIdRaw);
      if (!info) {
        logJoin("入群失败", "groupId=", gid, "reason=no_group_info");
        return;
      }

      const tmpl = pickWelcomeByCount(info.count);
      if (!tmpl || !String(tmpl).trim()) return;

      const message = formatText(tmpl, {
        count: info.count,
        groupId: gid,
        groupName: info.groupName,
        userId: userIdRaw,
        selfId: selfIdRaw,
      });
      if (!String(message).trim()) return;

      try {
        const sendResp = await wsCall("send_group_msg", { group_id: Number(gid), message });
        logJoin(
          "骰子入群已致辞",
          "groupId=",
          gid,
          "count=",
          info.count,
          "tries=",
          info.tries,
          "retcode=",
          sendResp && sendResp.retcode,
          "status=",
          sendResp && sendResp.status
        );
      } catch (e) {
        logJoin("骰子入群异常", "groupId=", gid, "err=", String(e && e.message ? e.message : e));
      }
    });
  }

  ext.onLoad = () => {
    connectWs();
  };

  connectWs();
}
