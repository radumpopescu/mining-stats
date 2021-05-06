const schedule = require("node-schedule");
const influxLog = require("./influx");
const DEBUG = process.env.DEBUG == "true";

const EZIL_ADDRESS = process.env.EZIL_ADDRESS;
const FLEXPOOL_ADDRESS = process.env.FLEXPOOL_ADDRESS;
const ETHERMINE_ADDRESS = process.env.ETHERMINE_ADDRESS;
const F2POOL_ADDRESS = process.env.F2POOL_ADDRESS;
const HIVEON_ADDRESS = process.env.HIVEON_ADDRESS;

const EZIL_ENABLED = process.env.EZIL_ENABLED == "true";
const FLEXPOOL_ENABLED = process.env.FLEXPOOL_ENABLED == "true";
const ETHERMINE_ENABLED = process.env.ETHERMINE_ENABLED == "true";
const F2POOL_ENABLED = process.env.F2POOL_ENABLED == "true";
const HIVEON_ENABLED = process.env.HIVEON_ENABLED == "true";

const {
  getRates,
  getStats,
  getBalance,
  getActualForecasts,
  getWinningEstimate,
} = require("./ezil");
const { getFlexpoolBalance, getFlexpoolEstimate } = require("./flexpool");
const { getEthermineBalance, getEthermineEstimate } = require("./ethermine");
const { getF2poolBalance } = require("./f2pool");
const { getHiveonData } = require("./hiveon");

async function update() {
  const toLog = [];
  if (EZIL_ENABLED) {
    // try {
    //   const rates = await getRates();
    //   Object.keys(rates).forEach((key) => {
    //     toLog.push({
    //       measurement: "ezil",
    //       key,
    //       value: rates[key],
    //     });
    //   });
    // } catch (e) {
    //   console.log(e.error);
    // }
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
  }
  if (FLEXPOOL_ENABLED) {
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
  }

  if (ETHERMINE_ENABLED) {
    try {
      const ethermineBalance = await getEthermineBalance(ETHERMINE_ADDRESS);
      toLog.push({
        measurement: "ethermine",
        key: "balance",
        value: ethermineBalance,
      });
    } catch (e) {
      console.log(e.error);
    }

    try {
      const ethermineEstimate = await getEthermineEstimate(ETHERMINE_ADDRESS);
      Object.keys(ethermineEstimate).forEach((key) => {
        toLog.push({
          measurement: "ethermine",
          key,
          value: ethermineEstimate[key],
        });
      });
    } catch (e) {
      console.log(e.error);
    }
  }

  if (F2POOL_ENABLED) {
    try {
      const stats = await getF2poolBalance(F2POOL_ADDRESS);
      Object.keys(stats).forEach((key) => {
        toLog.push({
          measurement: "f2pool",
          key,
          value: stats[key],
        });
      });
    } catch (e) {
      console.log(e.error);
    }
  }

  if (HIVEON_ENABLED) {
    try {
      const stats = await getHiveonData(HIVEON_ADDRESS);
      Object.keys(stats).forEach((key) => {
        toLog.push({
          measurement: "hiveon",
          key,
          value: stats[key],
        });
      });
    } catch (e) {
      console.log(e.error);
    }
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
    schedule.scheduleJob(`0 */2 * * * *`, update);
  }
})();
