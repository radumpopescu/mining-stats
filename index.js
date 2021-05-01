const schedule = require("node-schedule");
const influxLog = require("./influx");
const DEBUG = process.env.DEBUG == "true";

const EZIL_ADDRESS = process.env.EZIL_ADDRESS;
const FLEXPOOL_ADDRESS = process.env.FLEXPOOL_ADDRESS;

const {
  getRates,
  getStats,
  getBalance,
  getActualForecasts,
  getWinningEstimate,
} = require("./ezil");
const { getFlexpoolBalance, getFlexpoolEstimate } = require("./flexpool");

async function update() {
  const toLog = [];
  try {
    const rates = await getRates();
    Object.keys(rates).forEach((key) => {
      toLog.push({
        measurement: "ezil",
        key,
        value: rates[key],
      });
    });
  } catch (e) {
    console.log(e.error);
  }
  try {
    const stats = await getStats(EZIL_ADDRESS);
    Object.keys(stats).forEach((key) => {
      toLog.push({
        measurement: "ezil",
        key,
        value: stats[key],
      });
    });
    const winningEstimate = await getWinningEstimate(stats.averageHashrate);
    Object.keys(winningEstimate).forEach((key) => {
      toLog.push({
        measurement: "ezil",
        key,
        value: winningEstimate[key],
      });
    });
  } catch (e) {
    console.log(e.error);
  }
  try {
    const balance = await getBalance(EZIL_ADDRESS);
    Object.keys(balance).forEach((key) => {
      toLog.push({
        measurement: "ezil",
        key,
        value: balance[key],
      });
    });
  } catch (e) {
    console.log(e.error);
  }
  try {
    const actualForecasts = await getActualForecasts(EZIL_ADDRESS);
    Object.keys(actualForecasts).forEach((key) => {
      toLog.push({
        measurement: "ezil",
        key,
        value: actualForecasts[key],
      });
    });
  } catch (e) {
    console.log(e.error);
  }

  try {
    const flexpoolBalance = await getFlexpoolBalance(FLEXPOOL_ADDRESS);
    toLog.push({
      measurement: "flexpool",
      key: "balance",
      value: flexpoolBalance,
    });
  } catch (e) {
    console.log(e.error);
  }

  try {
    const flexpoolEstimate = await getFlexpoolEstimate(FLEXPOOL_ADDRESS);
    toLog.push({
      measurement: "flexpool",
      key: "estDaily",
      value: flexpoolEstimate,
    });
  } catch (e) {
    console.log(e.error);
  }

  if (DEBUG) {
    console.log({ toLog });
  } else {
    influxLog(toLog);
  }
}

(async () => {
  if (DEBUG) {
    update();
  } else {
    schedule.scheduleJob(`0 * * * * *`, update);
  }
})();
