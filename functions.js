const axios = require("axios");

async function makeRequest({ url, method, headers, data }) {
  let response = {};
  try {
    response = await axios({
      method: method || "get",
      url,
      headers,
      data,
      responseType: "json",
    });
  } catch (e) {
    console.error("error", e);
  }
  return response;
}

module.exports = { makeRequest };
