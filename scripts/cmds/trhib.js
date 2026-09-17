sock.ev.on("group-participants.update", async (update) => {
    if (update.action !== "add") return;

    const groupId = update.id;

    try {
        // معلومات الكروب الحالية
        const metadata = await sock.groupMetadata(groupId);

        const groupName = metadata.subject;
        const memberCount = metadata.participants.length;

        // الوقت والتاريخ الحقيقيين
        const now = new Date();

        const time = now.toLocaleTimeString("ar-MA", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        const date = now.toLocaleDateString("ar-MA", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });

        for (const participant of update.participants) {

            // اسم العضو
            let memberName = participant.split("@")[0];

            try {
                const contact = await sock.onWhatsApp(participant);

                if (contact && contact[0]?.name) {
                    memberName = contact[0].name;
                }
            } catch {}

            // رسالة الترحيب
            const welcome =
`🪻 𓆩⃝ 𝐁𝐎𝐓 ⌯★ 𝐒𝐀𝐇𝐓𝐎𝐔𝐓 💍🐋

╔══════════════════════╗
       🌸 أَهْلًا وَسَهْلًا 🌸
╚══════════════════════╝

🤍 مرحباً بك يا
『 ${memberName} 』

✨ نورت عائلتنا بانضمامك إلينا ✨
وجودك زاد المجموعة نوراً وجمالاً 🌿

╭──────〔 🏠 معلومات المجموعة 〕──────╮
│
│ 🏠 المجموعة : ${groupName}
│ 👥 الأعضاء  : ${memberCount}
│ 🕒 الوقت    : ${time}
│ 📅 التاريخ  : ${date}
│
╰────────────────────────────────╯

🌙 نتمنى لك إقامة جميلة بين إخوتك،
🤍 واحترم الجميع واستمتع بوقتك معنا.

✦ ──────── ✦ ──────── ✦

🪻 نورتنا ونورت المكان بوجودك 🪻
💍 نتمنى نشوف منك أحلى حضور وأجمل تفاعل 💍

𓆩🐋𓆪 𝐁𝐎𝐓 𝐒𝐀𝐇𝐓𝐎𝐔𝐓 𓆩🐋𓆪`;

            // إرسال الترحيب
            await sock.sendMessage(groupId, {
                text: welcome,
                mentions: [participant]
            });
        }

    } catch (error) {
        console.error("❌ WELCOME ERROR:", error);
    }
});
