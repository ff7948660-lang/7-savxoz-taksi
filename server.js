const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;


// JSON ma'lumotlarni qabul qilish
app.use(express.json());


// Sayt fayllarini chiqarish
app.use(express.static(__dirname));


// ================================
// HAYDOVCHI ARIZASI
// ================================

app.post("/api/driver", async (req, res) => {

    try {

        const {
            name,
            phone,
            car,
            plate
        } = req.body;


        // Majburiy maydonlarni tekshirish
        if (!name || !phone || !car || !plate) {

            return res.status(400).json({
                ok: false,
                message: "Barcha maydonlarni to‘ldiring."
            });

        }


        // Telegram sozlamalari
        const token =
            process.env.TELEGRAM_BOT_TOKEN;

        const chatId =
            process.env.TELEGRAM_CHAT_ID;


        // Telegram sozlamalari mavjudligini tekshirish
        if (!token || !chatId) {

            console.error(
                "Telegram token yoki Chat ID topilmadi."
            );

            return res.status(500).json({
                ok: false,
                message: "Telegram sozlamalari topilmadi."
            });

        }


        // Telegramga yuboriladigan xabar
        const message = `
🚕 YANGI HAYDOVCHI ARIZASI

👤 Ism: ${name}
📞 Telefon: ${phone}
🚗 Mashina: ${car}
🔢 Davlat raqami: ${plate}

📍 7-Savxoz Tezkor Taksi
        `.trim();


        // Telegram Bot API
        const telegramUrl =
            `https://api.telegram.org/bot${token}/sendMessage`;


        const telegramResponse =
            await fetch(telegramUrl, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    chat_id: chatId,

                    text: message

                })

            });


        const telegramData =
            await telegramResponse.json();


        // Telegram javobini tekshirish
        if (!telegramData.ok) {

            console.error(
                "Telegram xatosi:",
                telegramData
            );

            return res.status(500).json({

                ok: false,

                message:
                    "Telegramga yuborishda xatolik."

            });

        }


        // Muvaffaqiyatli javob
        console.log(
            "✅ Haydovchi arizasi Telegramga yuborildi."
        );


        res.json({

            ok: true,

            message:
                "Arizangiz muvaffaqiyatli yuborildi!"

        });


    } catch (error) {

        console.error(
            "Server xatosi:",
            error
        );


        res.status(500).json({

            ok: false,

            message:
                "Serverda xatolik yuz berdi."

        });

    }

});


// ================================
// SERVERNI ISHGA TUSHIRISH
// ================================

app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            "🚕 7-Savxoz Taksi serveri ishga tushdi:"
        );

        console.log(
            `Port: ${PORT}`
        );

    }
);