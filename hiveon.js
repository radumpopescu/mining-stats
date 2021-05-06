const { makeRequest } = require("./functions");

async function getHiveonData(address) {
  const response = await makeRequest({
    url: `https://hiveon.net/api/v1/stats/miner/${address}/ETH/billing-acc`,
  });
  const result = response.data;

  if (result) {
    return {
      estDaily: result.expectedReward24H,
      balance: result.totalUnpaid,
    };
  }
  return {};
}

module.exports = { getHiveonData };
