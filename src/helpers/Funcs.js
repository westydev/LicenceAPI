const axios = require("axios").default;

function generateToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < 64; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};

async function sendMessageForWebhook(webhookurl, msg, username) {
    await axios(webhookurl, {
      method: "POST",
      data: {
        username: username,
        content: msg,
      },
    });
}

module.exports = { generateToken, sendMessageForWebhook };