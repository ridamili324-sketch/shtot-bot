const activeRuns = new Map();

const WORDS = [
  "نيڪ",
  "عروق",
  "القحبة",
  "مڪ",
  "مص",
  "زب",
  "الملڪ",
  "سحتوت",
  "زلال",
  "امك",
  "يا ضعيفة",
  "انا",
  "نياڪ",
  "متاعك",
  "مراهقة",
  "تاع زبي",
  "أم"
];

function stop(threadID, senderID) {
  const key = `${threadID}:${senderID}`;
  const timer = activeRuns.get(key);

  if (!timer) return false;

  clearTimeout(timer);
  activeRuns.delete(key);
  return true;
}

module.exports = {
  config: {
    name: "hwii",
    aliases: ["هوي", "حوي"],
    version: "1.0",
    author: "Azadx69x",
    countDown: 3,
    role: 1,
    description: {
      en: "Loop words"
    },
    category: "box chat",
    guide: {
      en: "{pn} امهم | {pn} off"
    }
  },

  onStart: async function ({ api, event, args, message }) {

    const key = `${event.threadID}:${event.senderID}`;

    // إيقاف الأمر
    if ((args[0] || "").toLowerCase() === "off") {
      return message.reply(
        stop(event.threadID, event.senderID)
          ? "✅ تم إيقاف الأمر."
          : "ℹ️ ما كاين حتى أمر خدام."
      );
    }

    // التحقق من طريقة التشغيل
    if ((args[0] || "").toLowerCase() !== "امهم") {
      return message.reply(
        "طريقة الاستخدام:\n\nhwii امهم\n\nوللإيقاف:\nhwii off"
      );
    }

    // إيقاف أي تشغيل قديم
    stop(event.threadID, event.senderID);

    let index = 0;

    const sendNext = async () => {
      try {
        if (index >= WORDS.length) {
          index = 0;
        }

        await api.sendMessage(
          WORDS[index++],
          event.threadID
        );

        const timer = setTimeout(sendNext, 650);
        activeRuns.set(key, timer);

      } catch (error) {
        activeRuns.delete(key);
        console.error("[hwii] stopped:", error.message);
      }
    };

    await message.reply(
      "✅ بدأ الإرسال المتكرر.\n🛑 للإيقاف: hwii off"
    );

    sendNext();
  }
};
