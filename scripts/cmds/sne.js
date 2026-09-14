const axios = require("axios");
const fs = require("fs");
const path = require("path");

const running = new Map(); // نخزنو اللوب ديال كل كروب

module.exports = {
  config: {
    name: "suuu",
    aliases: ["سسو", "su"],
    version: "2.0.2",
    author: "shtot",
    countDown: 5,
    role: 0,
    shortDescription: "إعادة إرسال صورة لا محدود",
    longDescription: "كيبقا يعاود يرسل نفس الصورة حتى توقفو",
    category: "fun",
    guide: "رد على صورة و كتب: suuu\nللتوقيف: suuu stop"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    // 1. أمر الإيقاف
    if (event.body && (event.body.toLowerCase() === "suuu stop" || event.body.toLowerCase() === "suuu off")) {
      if (!running.has(threadID)) {
        return api.sendMessage("❌ ما كاين حتى صورة كتتعاود.", threadID);
      }

      clearInterval(running.get(threadID));
      running.delete(threadID);

      return api.sendMessage("⛔ تم إيقاف suuu.", threadID);
    }

    // 2. منع تشغيل 2 عمليات فنفس الكروب
    if (running.has(threadID)) {
      return api.sendMessage("⚠️ راه suuu خدام دابا.\nللتوقيف: suuu stop", threadID);
    }

    // 3. خاصو يرد على صورة
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments.length === 0
    ) {
      return api.sendMessage("📸 رد على صورة وكتب: suuu", threadID);
    }

    const image = event.messageReply.attachments.find(att => att.type === "photo");
    if (!image || !image.url) {
      return api.sendMessage("❌ رد على صورة.", threadID);
    }

    let count = 0;
    const file = path.join(__dirname, `suuu_${threadID}_${Date.now()}.jpg`);

    try {
      // نحملو الصورة مرة وحدة برا اللوب باش منثقلوش
      const response = await axios({
        method: "GET",
        url: image.url,
        responseType: "arraybuffer"
      });
      fs.writeFileSync(file, response.data);

      api.sendMessage("▶️ بدا suuu.\n⏱️ كل 3 ثواني\n🛑 للتوقيف: suuu stop", threadID);

      // 4. اللوب لا محدود
      const timer = setInterval(async () => {
        if (!running.has(threadID)) {
          if (fs.existsSync(file)) fs.unlinkSync(file);
          return;
        }

        count++;
        try {
          await api.sendMessage(
            {
              body: `🖼️ suuu #${count}`,
              attachment: fs.createReadStream(file)
            },
            threadID
          );
        } catch (err) {
          clearInterval(timer);
          running.delete(threadID);
          if (fs.existsSync(file)) fs.unlinkSync(file);
          return api.sendMessage("❌ وقع خطأ. تم الإيقاف.", threadID);
        }
      }, 3000); // 3 ثواني بين كل صورة

      running.set(threadID, timer);

    } catch (err) {
      console.error(err);
      if (fs.existsSync(file)) fs.unlinkSync(file);
      api.sendMessage("❌ وقع مشكل فتحميل الصورة.", threadID);
    }
  }
};
