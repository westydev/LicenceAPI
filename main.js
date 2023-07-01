const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const chalk = require("chalk").default;
const http = require("http");


const User = require("./src/schemas/User")
const index = require("./src/routers/index");
const { removeItemAll, calculateTimeDifference, sendMessageForWebhook, setTitle } = require("./src/helpers/Funcs");

const app = express();
const server = http.createServer(app);
const PORT = 3003;


const { Server } = require("socket.io");
const io = new Server(server);

let Clients = [];
let LoginLogoutWebhook = ``;
let mongooseDatabase = "";

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

app.use("/", index);

setTitle(`Westy Licence`);

io.on("connection", async (socket) => {
    const UserHandshake = socket.handshake;

    const UserInformation = {};

    UserInformation["AuthInformations"] = UserHandshake.auth;
    UserInformation["IpAdress"] = UserHandshake.address;
    UserInformation["Time"] = UserHandshake.time;

    if (!UserInformation["AuthInformations"].key || !UserInformation["AuthInformations"].hwid  || !UserInformation["AuthInformations"].loginType) return socket.disconnect();

    const UserDatabaseInformations = await User.findOne({ key: UserInformation["AuthInformations"].key, hwid: UserInformation["AuthInformations"].hwid });

    if(!UserDatabaseInformations) return socket.disconnect();

    if(!UserDatabaseInformations.keys.includes(UserInformation["AuthInformations"].loginType)) return socket.disconnect();
    
    UserInformation["Username"] = UserDatabaseInformations.username;
    UserInformation["EndLicence"] = UserDatabaseInformations.endDate;

    Clients.push(UserInformation);

    const Baslangic = Date.now();

    await User.findOneAndUpdate(
        { key: UserInformation["AuthInformations"].key },
        { $inc: { logined: 1 } },
        { upsert: true }
       );

       let jsonData = {
        username: "Login-Log",
        embeds: [
          {
            title: "Lisansa Giriş Yapıldı",
            description: `
              Key: ||${UserInformation["AuthInformations"].key}||
              Username: **${UserInformation["Username"]}**
              Hwid: ||${UserInformation["AuthInformations"].hwid}||
              Giriş Sayısı: ${UserDatabaseInformations.logined + 1}
              Lisansın Geçerlilik Zamanı: ${calculateTimeDifference(Date.now(), UserInformation["EndLicence"] )}
              IP: || ${UserInformation["IpAdress"]} ||
              `,
          },
        ],
      };

      await sendMessageForWebhook(
        LoginLogoutWebhook,
        jsonData
      );   
    
    socket.on("disconnect", async () => {
    await removeItemAll(Clients, UserInformation);

    const End = Date.now();


    let jsonData = {
        username: "Logout-Log",
        embeds: [
          {
            title: "Lisanstan Çıkış Yapıldı",
            description: `
              Key: ||${UserInformation["AuthInformations"].key}||
              Username: **${UserInformation["Username"]}**
              Hwid: ||${UserInformation["AuthInformations"].hwid}||
              Giriş Sayısı: ${UserDatabaseInformations.logined + 1}
              Lisansın Geçerlilik Zamanı: ${calculateTimeDifference(Date.now(), UserInformation["EndLicence"] )}
              IP: || ${UserInformation["IpAdress"]} ||
              Oturum Süresi: ${calculateTimeDifference(Baslangic, End)}
              `,
          },
        ],
      };

      await sendMessageForWebhook(
        LoginLogoutWebhook,
        jsonData
      );   
   }); 
  });



//#region Server Listen
server.listen(3003, async () => {
    await mongoose.set("strictQuery", true)
    await mongoose.connect(mongooseDatabase);

    console.log(chalk.green(`Api Started http://localhost:${PORT}`));

    setInterval(async () => {
        const users = await User.find();

        users.forEach(async u => {
            if(Date.now() > u.endDate) {
                await User.findOneAndDelete({ username: u.username })
            }
        });
    }, 15 * 1000);
});
//#endregion