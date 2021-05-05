const { makeRequest } = require("./functions");

async function getF2poolBalance(address) {
  const response = await makeRequest({
    url: `https://api.f2pool.com/eth/${address}`,
  });
  const result = response.data;

  if (result) {
    return {
      // balance: result.value_today + result.static_balance,
      balance: result.balance,
    };
  }
  return {};
}

module.exports = { getF2poolBalance };
