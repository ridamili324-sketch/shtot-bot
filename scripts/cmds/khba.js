module.exports = {
  config: {
    name: "خرج لقحبة مو",
    aliases: ["خرج", "khrj"],
    version: "1.0.0",
    author: "shtot",
    countDown: 3,
    role: 0,
    shortDescription: "إزالة شخص من المجموعة",
    longDescription: "كيحيد الشخص اللي رديتي على رسالتو من المجموعة",
    category: "fun",
    guide: "رد على رسالة شخص وكتب: خرج لقحبة مو"
  },

  onStart: async function ({ api, event }) {
    const threadID = event.threadID;

    // خاص الأمر يكون داخل مجموعة
    if (!event.isGroup) {
      return api.sendMessage(
        "❌ هاد الأمر خدام غير فالمجموعات.",
        threadID
      );
    }

    // خاص المستخدم يرد على رسالة الشخص
    if (!event.messageReply) {
      return api.sendMessage(
        "⚠️ خاصك ترد على رسالة الشخص وكتب:\nخرج لقحبة مو",
        threadID
      );
    }

    const userID = event.messageReply.senderID;

    // منع البوت من محاولة حذف راسو
    if (userID === api.getCurrentUserID()) {
      return api.sendMessage(
        "🤣 باغي نحيد راسي؟ مستحيل.",
        threadID
      );
    }

    try {
      // جلب معلومات المجموعة
      const threadInfo = await api.getThreadInfo(threadID);

      // التأكد أن الشخص موجود فالمجموعة
      if (!threadInfo.participantIDs.includes(userID)) {
        return api.sendMessage(
          "❌ هاد الشخص ما بقاش فالمجموعة.",
          threadID
        );
      }

      // إزالة الشخص
      await api.removeUserFromGroup(userID, threadID);

      // الرسالة بعد الإزالة
      return api.sendMessage(
        "🚪 تمت إزالة لقحبة مو من المجموعة\n\nمكاينش رجعة 🤣🤣🙏🏻🍆",
        threadID
      );

    } catch (err) {
      console.error("خرج لقحبة مو:", err);

      return api.sendMessage(
        "❌ مقدرتش نحيدو.\nتأكد أن البوت Admin فالمجموعة وعندو صلاحية إزالة الأعضاء.",
        threadID
      );
    }
  }
};
