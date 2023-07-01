const axios = require("axios").default;

function generateToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';

  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters.charAt(randomIndex);
  }

  return token;
};

async function sendMessageForWebhook(webhookurl, data) {
    await axios(webhookurl, {
      method: "POST",
      data: data,
    });
}

function calculateTimeDifference(startDate, endDate) {
  const difference = Math.abs(endDate - startDate) / 1000; // Saniye cinsinden fark

  const days = Math.floor(difference / 86400);
  const hours = Math.floor((difference % 86400) / 3600);
  const minutes = Math.floor((difference % 3600) / 60);
  const seconds = Math.floor(difference % 60);

  const formattedTime = `${days} Gün | ${hours} Saat | ${minutes} Dakika | ${seconds} Saniye`;

  return formattedTime;
}

function removeItemAll(arr, value) {
  var i = 0;
  while (i < arr.length) {
    if (arr[i] === value) {
      arr.splice(i, 1);
    } else {
      ++i;
    }
  }
  return arr;
}

function setTitle(title) {
  if (process.platform == "win32") {
    process.title = title;
  } else {
    process.stdout.write("\x1b]2;" + title + "\x1b\x5c");
  }
}

module.exports = { generateToken, sendMessageForWebhook, calculateTimeDifference, removeItemAll, setTitle };