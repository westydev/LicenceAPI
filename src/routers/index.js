const router = require("express").Router()
const axios = require("axios");

const User = require("../schemas/User");
const { generateToken, sendMessageForWebhook } = require("../helpers/Funcs");


const adminKey = "westydeddd"

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
              "webhook",
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
     if (data.key && data.loginType) {
        const userData = await User.findOne({ key: data.key });

        if(userData) {
            res.send({
              state: "SUCCESS",
              msg: "Key Dogru, Giris Basarili.",
            });

            await User.findOneAndUpdate(
              { key: data.key },
              { $inc: { logined: 1 } },
              { upsert: true }
            );

            await sendMessageForWebhook(
              "webhook",
              `Mevcut Bir Keye Giriş Yapıldı. Kullanıcı İsmi **${userData.username}** . Kullanılan Key Türü  **${data.loginType}**. Toplam Giriş Sayısı ${userData.logined + 1}.`,
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
