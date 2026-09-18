module.exports = {
  config: {
    name: "ليسا",
    version: "1.0",
    author: "YourName",
    countDown: 2,
    role: 0,
    description: "ليسا كترد على الشخص اللي فعلها",
    category: "fun",
    guide: {
      en: "{pn} تفعيل\n{pn} تعطيل"
    }
  },

  onStart: async function ({ event, message }) {
    global.lisaActive ??= {};

    const threadID = String(event.threadID);
    const userID = String(event.senderID);
    const text = String(event.body || "").trim();

    global.lisaActive[threadID] ??= {};

    const command = text
      .replace(/^ليسا\s*/i, "")
      .trim();

    if (
      command === "تفعيل" ||
      command === "تشغيل" ||
      command === "شغل"
    ) {
      global.lisaActive[threadID][userID] = true;

      return message.reply(
        "تفعّلات ليك ليسا ❤️😂 من دابا غادي نبقى نجاوبك فكل رسالة."
      );
    }

    if (
      command === "تعطيل" ||
      command === "توقيف" ||
      command === "وقف" ||
      command === "حبس"
    ) {
      delete global.lisaActive[threadID][userID];

      return message.reply(
        "صافي 😂❤️ وقفتها عليك."
      );
    }

    return message.reply(
      "كتب:\nليسا تفعيل\nأو\nليسا تعطيل"
    );
  },

  onChat: async function ({ event, message }) {
    global.lisaActive ??= {};

    const threadID = String(event.threadID);
    const userID = String(event.senderID);

    if (!global.lisaActive[threadID]?.[userID]) return;

    if (!event.messageID) return;

    // ما تجاوبش البوت مع راسو
    try {
      const botID = String(event.api?.getCurrentUserID
        ? await event.api.getCurrentUserID()
        : "");

      if (botID && userID === botID) return;
    } catch (e) {}

    const text = String(event.body || "").trim();

    // ما تجاوبش على أوامر ليسا
    if (/^ليسا\s+(تفعيل|تشغيل|شغل|تعطيل|توقيف|وقف|حبس)$/i.test(text)) {
      return;
    }

    const love = [
      "آ سحتوت ❤️ كلامك ديما كيخليني نبتسم، راك عزيز بزاف عليا 😌",
      "واا سحتوت 😘❤️ هاد الهضرة ديالك فيها الحنان، راك زوين بزاف.",
      "آ الغالي ❤️ حتى الكلام البسيط منك كيعجبني.",
      "سحتوت ديالي 😂❤️ راك كتستاهل الدلال كامل."
    ];

    const funny = [
      "هههههههه آ سحتوت 😂 والله حتى كتضحكني، عندك ستيل خاص.",
      "وااا سحتوت 🤣❤️ نتا بوحدك كتقدر تجيب هاد التخربيق.",
      "ههههه آ الزوين 😂 ديما كتخليني نضحك.",
      "آ سحتوت 😂❤️ الهضرة معاك عمرها تكون مملة."
    ];

    const sad = [
      "آ سحتوت 🥺❤️ إلا كنت مضايق هضر معايا، ما تبقاش كاتمها.",
      "يا الغالي ❤️ تهلا فراسك، راك عزيز وما بغيتكش حزين.",
      "آ سحتوت 😌❤️ خد شوية ديال الراحة، كلشي غادي يدوز.",
      "ما تحزنش يا الزوين ❤️ أنا هنا نونسّك شوية."
    ];

    const normal = [
      "آ سحتوت 😌❤️ فهمتك، وديما كتكون الهضرة معاك زوينة.",
      "هههه آ سحتوت 😂 عندك طريقة خاصة فالهضرة.",
      "واخا يا الغالي ❤️ كلامك ديما عندو نكهة خاصة.",
      "آ الزوين سحتوت 😏❤️ عجبني الكلام ديالك.",
      "بصراحة سحتوت، راك شخص مميز والهضرة معاك ما كتملش ❤️",
      "ههههه آ سحتوت 😂 حتى الكلام العادي منك كيكون زوين.",
      "إيوا آ الغالي 😌❤️ كمّل هضر معايا، كنسمع ليك."
    ];

    let pool = normal;

    if (
      /حب|كنحب|نحب|حبيب|قلبي|عمري|غالي|توحشت|اشتقت|❤️|😍|😘|🥰/i.test(text)
    ) {
      pool = love;
    }

    else if (
      /هههه|خخخ|😂|🤣|😹|ضحك|مضحك/i.test(text)
    ) {
      pool = funny;
    }

    else if (
      /حزين|حزن|بكيت|دموع|تعبان|عيان|زعلان|مقلق|😭|😢/i.test(text)
    ) {
      pool = sad;
    }

    const reply = pool[Math.floor(Math.random() * pool.length)];

    return message.reply(reply);
  }
};
