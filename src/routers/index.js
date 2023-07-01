const router = require("express").Router()
const axios = require("axios");

const User = require("../schemas/User");
const {
  generateToken,
  sendMessageForWebhook,
  calculateTimeDifference,
} = require("../helpers/Funcs");


const adminKey = "Adminpass";

router.post("/adminDeleteKey", async (req, res) => {
    const data = req.body;
    try {
        if (data.adminKey && data.username) {
          if (data.adminKey === adminKey) {
          await User.findOneAndDelete({ username: data.username });
          res.send({
            state: "SUCCESS",
            msg: "Key Silindi."
          })
          } else {
             res.send({
               state: "ERROR",
               msg: "Key Yanlis.",
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


router.post("/admin", async (req, res) => {
    const data = req.body;
    try {
        if (data.adminKey && data.username && data.day && data.hwidRequired && data.hwid && data.keys) {
          if (data.adminKey === adminKey) {
            const tkn = generateToken();
            const nowDate = Date.now();
            
            var userdata = new User({
              key: tkn,
              username: data.username,
              startdate: nowDate,
              hwidRequired: data.hwidRequired,
              hwid: data.hwid,
              keys: data.keys,
              endDate: nowDate + 1000 * 60 * 60 * 24 * data.day,
              logined: 0,
            });

           await userdata.save();

            res.send({
              state: "SUCCESS",
              msg: "Keyiniz Oluşturuldu.",
              keyData: {
                key: tkn,
                username: data.username,
                endDate: nowDate + ((1000 * 60 * 60 * 24) * data.day)
              },
            });

            let jsonData = {
              username: "Admin-Log",
              embeds: [
                {
                  title: "Yeni Bir Key Oluşturuldu",
                  description: `
                  Key: ||${tkn}||
                  Username: **${data.username}**
                  Hwid: ||${data.hwid}||
                  Hwid Gerekliliği: ${data.hwidRequired}
                  Özellikler: ${data.keys}
                  `,
                },
              ],
            };

            await sendMessageForWebhook(
              "URL",
              jsonData
            );
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

router.get("/currentVersions", async (req, res) => { 
  const versionObject = {};

  versionObject["Spoofer"] = "0.2";

  res.send(versionObject)
});

module.exports = router;