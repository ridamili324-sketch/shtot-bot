const activeRuns = new Map();

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
    description: {
      en: "Send the configured word sequence continuously"
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
          : "ℹ️ لا يوجد أمر مفعّل."
      );
    }

    // التحقق من طريقة الاستعمال
    if ((args[0] || "").toLowerCase() !== "امهم") {
      return message.reply(
        "طريقة الاستخدام: نيك امهم أو نيك off"
      );
    }

    // إيقاف أي تشغيل قديم
    stop(event.threadID, event.senderID);

    let index = 0;

    const sendNext = async () => {
      // إذا وصل لآخر كلمة يرجع للأولى
      if (index >= WORDS.length) {
        index = 0;
      }

      try {
        await api.sendMessage(
          WORDS[index],
          event.threadID
        );

        index++;

        // يعاود الإرسال بعد 650ms
        const timer = setTimeout(sendNext, 650);
        activeRuns.set(key, timer);

      } catch (error) {
        activeRuns.delete(key);
        console.error("[nik] stopped:", error.message);
      }
    };

    await message.reply(
      "✅ بدأ إرسال الكلمات بشكل مستمر.\nللتوقف: نيك off"
    );

    sendNext();
  }
};
