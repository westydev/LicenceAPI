const router = require("express").Router()
const axios = require("axios");

const User = require("../schemas/User");
const { generateToken, sendMessageForWebhook } = require("../helpers/Funcs");


const adminKey = "gjdkjdkfgdklgjdfkgkdf"

router.post("/admin", async (req, res) => {
    const data = req.body;
    try {
        if (data.adminKey && data.username && data.day) {
          if (data.adminKey === adminKey) {
            if(typeof data.day == "number") {
            const tkn = generateToken();
            const nowDate = Date.now();
            
            var userdata = new User({
                key: tkn,
                username: data.username,
                startdate: nowDate,
                endDate: nowDate + ((1000 * 60 * 60 * 24) * data.day),
                logined: 0
            });

           await userdata.save();

            res.send({
              state: "SUCCESS",
              msg: "key olusturuldu.",
              keyData: {
                key: tkn,
                username: data.username,
                endDate: nowDate + ((1000 * 60 * 60 * 24) * data.day)
              },
            });

            await sendMessageForWebhook(
              "https://discord.com/api/webhooks/1110619696224550967/zefWNbtLuuC80t0tImtIk6kILnOWMIRoZyKuHaxyrCPZ4K1Ub6UjK_Z45qnrlu4ZjBwJ",
              `Yeni Bir Key Oluşturuldu. ||** ${tkn} **||. Kullanıcı İsmi **${data.username}**`,
              "Admin-LOG"
            );

        } else {
             res.send({
               state: "ERROR",
               msg: "Lutfen Day-e bir rakam giriniz.",
             });
        }
          } else {
            res.send({
              state: "ERROR",
              msg: "key yanlis.",
            });
          }
        } else {
          res.send({
            state: "ERROR",
            msg: "Tam Doldurunuz.",
          });
        }
    } catch (error) {
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    const data = req.body;
    try {
     if (data.username && data.key && data.loginType) {
        const userData = await User.findOne({ key: data.key, username: data.username });

        if(userData) {
            res.send({
              state: "SUCCESS",
              msg: "Key Dogru, Giris Basarili.",
            });

            await User.findOneAndUpdate(
              { key: data.key, username: data.username },
              { $inc: { logined: 1 } },
              { upsert: true }
            );

            await sendMessageForWebhook(
              "https://discord.com/api/webhooks/1110624607284764782/TqrULpaeC7Zu0nFPLSHTAP4SgereFxsRuTkMnic_k7U1n3a7O2P_jYpQsKuEZubtYA2T",
              `Mevcut Bir Keye Giriş Yapıldı. Kullanıcı İsmi **${data.username}** . Kullanılan Key Türü  **${data.loginType}**. Toplam Giriş Sayısı ${userData.logined + 1}.`,
              "Login-LOG"
            );
        } else {
             res.send({
               state: "ERROR",
               msg: "Key veya Username Yanlis.",
             });
        }
     } else {
        res.send({
          state: "ERROR",
          msg: "Tam Doldurunuz.",
        });
     }   
    } catch (error) {
        console.log(error);
    }
})



module.exports = router;