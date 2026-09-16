const activeRuns = new Map();

const WORDS = [
  "نيڪ", "امڪ", "القحبه", "ابلع", "زب", "الملڪ", "بسيط",
  "نياڪڪ", "يا", "قحبه", "امڪ", "نفشخ", "لها", "طبونها",
  "ضعيفة", "الشخصية", "راقبي", "نڪح", "ام", "ام", "ام",
  "امڪ 😹"
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
    name: "nik",
    aliases: ["نيك", "نیک"],
    version: "1.0",
    author: "Azadx69x",
    countDown: 3,
    role: 1,
    description: { en: "Send the configured word sequence one message at a time" },
    category: "box chat",
    guide: { en: "{pn} امهم | {pn} off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const key = `${event.threadID}:${event.senderID}`;
    if ((args[0] || "").toLowerCase() === "off") {
      return message.reply(stop(event.threadID, event.senderID) ? "✅ تم إيقاف الأمر." : "ℹ️ لا يوجد أمر مفعّل.");
    }
    if ((args[0] || "").toLowerCase() !== "امهم") {
      return message.reply("طريقة الاستخدام: نيك امهم أو نيك امهم off");
    }

    stop(event.threadID, event.senderID);
    let index = 0;
    const sendNext = async () => {
      if (index >= WORDS.length) {
        activeRuns.delete(key);
        return;
      }
      try {
        await api.sendMessage(WORDS[index++], event.threadID);
        const timer = setTimeout(sendNext, 650);
        activeRuns.set(key, timer);
      } catch (error) {
        activeRuns.delete(key);
        console.error("[nik] stopped:", error.message);
      }
    };

    await message.reply("✅ بدأ إرسال الكلمات متقطعة.\nللتوقف: نيك off");
    sendNext();
  }
};
