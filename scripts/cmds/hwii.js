const activeRuns = new Map();

const WORDS = [
  "يا هلا 👑",
  "نورتنا",
  "الملك وصل",
  "يا غالي",
  "يا حلو",
  "يا بطل",
  "يا اسطورة",
  "منور الجروب",
  "احلى واحد",
  "قلب كبير ❤️",
  "خليك منور",
  "ضحكتك حلوة",
  "كلامك عسل",
  "مكانك عالي",
  "تستاهل كل خير",
  "ربي يحفظك",
  "يا فخم 😹"
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
    version: "1.1",
    author: "Azadx69x",
    countDown: 3,
    role: 1,
    description: { en: "Loop nice words" },
    category: "box chat",
    guide: { en: "{pn} امهم | {pn} off" }
  },

  onStart: async function ({ api, event, args, message }) {
    const key = `${event.threadID}:${event.senderID}`;
    if ((args[0] || "").toLowerCase() === "off") {
      return message.reply(stop(event.threadID, event.senderID)? "✅ تم إيقاف الأمر." : "ℹ️ لا يوجد أمر مفعّل.");
    }
    if ((args[0] || "").toLowerCase()!== "امهم") {
      return message.reply("طريقة الاستخدام: hwii امهم أو hwii off");
    }

    stop(event.threadID, event.senderID);
    let index = 0;
    const sendNext = async () => {
      try {
        // هنا كيعاود من الأول ملي يسالي
        if (index >= WORDS.length) index = 0;

        await api.sendMessage(WORDS[index++], event.threadID);
        const timer = setTimeout(sendNext, 650);
        activeRuns.set(key, timer);
      } catch (error) {
        activeRuns.delete(key);
        console.error("[hwii] stopped:", error.message);
      }
    };

    await message.reply("✅ بدأ الإرسال المتكرر.\nللتوقف: hwii off");
    sendNext();
  }
};
