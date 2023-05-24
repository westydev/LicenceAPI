const axios = require("axios").default;

/*
async function c(params) {
  const r = await axios("http://localhost:3003/admin", {
    method: "POST",
    data: {
      adminKey: "gjdkjdkfgdklgjdfkgkdf",
      username: "Westy",
      day: 5,
    },
  });

 console.log(await r.data);
}
c();
*/

async function c(params) {
  const r = await axios("http://localhost:3003/login", {
    method: "POST",
    data: {
      username: "Westy",
      key: "CFQo8tsVKDMHhL5UAvGLe3ytCgMIKZNYVzdgsQBKIcx2rQVJNiiSP5Cr2zS8u88t",
      loginType: "Valorant Cheat"
    },
  });

  console.log(await r.data);
}
c()