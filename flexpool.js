const { makeRequest } = require("./functions");

function processLongEthNumber(n) {
  return Math.round(n / 100000000000) / 10000000;
}

async function getFlexpoolBalance(address) {
  const response = await makeRequest({
    url: `https://flexpool.io/api/v1/miner/${address}/balance/`,
  });
  const { result } = response.data;

  if (result) {
    return processLongEthNumber(result);
  }
  return result;
}

async function getFlexpoolEstimate(address) {
  const response = await makeRequest({
    url: `https://flexpool.io/api/v1/miner/${address}/estimatedDailyRevenue/`,
  });
  const { result } = response.data;

  if (result) {
    return processLongEthNumber(result);
  }
  return result;
}

module.exports = { getFlexpoolBalance, getFlexpoolEstimate };
