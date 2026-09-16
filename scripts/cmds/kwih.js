const activeRuns = new Map();

const WORDS = [
   
const WORDS = [
  "نيڪ",
  "مڪ",
  "القحبه",
  "طحتي",
  "فزلال",
  "مك",
  "سحتوت",
  "نعوق",
  "مك",
  "خروفة",
  "تاعي",
  "ليلة",
  "ليلتك",
  "غتحواي",
  "بزز",
  "ولا",
  "بلخاطر",
  "انا",
  "حواي",
  "مك",
  "نيك",
  "أم",
  "أمك",
  "القحبة",
  "ليلة",
  "غتهزيه",
  "بقلاويه",
  "ضعيفة",
  "تاع",
  "زبي",
  "عتارفي",
  "بحواي",
  "مك",
  "سحتوت",
  "مراهقة",
  "نجبد",
  "زبي",
  "نحطوا",
  "ليك",
  "فوق",
  "جبهتك",
  "ديري عقلك",
  "لقحبة",
  "قبل",
  "منبول",
  "عليك"
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
    name: "kwih",
    aliases: ["كويه", "kwih"],
    version: "1.2",
    author: "Azadx69x",
    countDown: 3,
    role: 1,
    description: { en: "Loop nice words" },
    category: "box chat",
    guide: { en: "{pn} امهم | {pn} stop" }
  },

  onStart: async function ({ api, event, args, message }) {
    const key = `${event.threadID}:${event.senderID}`;
    if ((args[0] || "").toLowerCase() === "stop") {
      return message.reply(stop(event.threadID, event.senderID)? "✅ تم إيقاف الأمر." : "ℹ️ لا يوجد أمر مفعّل.");
    }
    if ((args[0] || "").toLowerCase()!== "امهم") {
      return message.reply("طريقة الاستخدام: kwih امهم أو kwih stop");
    }

    stop(event.threadID, event.senderID);
    let index = 0;
    const sendNext = async () => {
      try {
        if (index >= WORDS.length) index = 0;
        await api.sendMessage(WORDS[index++], event.threadID);
        const timer = setTimeout(sendNext, 650);
        activeRuns.set(key, timer);
      } catch (error) {
        activeRuns.delete(key);
        console.error("[kwih] stopped:", error.message);
      }
    };

    await message.reply("✅ بدأ الإرسال المتكرر.\nللتوقف: kwih stop");
    sendNext();
  }
};
