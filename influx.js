require("dotenv").config();
const Influx = require("influx");

const database = process.env.INFLUX_DB;
const influx = new Influx.InfluxDB({
  host: process.env.INFLUX_HOST,
  database,
  username: process.env.INFLUX_USER,
  password: process.env.INFLUX_PASS,
  schema: [
    {
      measurement: "ezil",
      fields: {
        currentHashrate: Influx.FieldType.INTEGER,
        averageHashrate: Influx.FieldType.INTEGER,
        reportedHashrate: Influx.FieldType.INTEGER,
        estDailyJustEth: Influx.FieldType.FLOAT,
        eth: Influx.FieldType.FLOAT,
        zil: Influx.FieldType.FLOAT,
        estDailyZil: Influx.FieldType.FLOAT,
        estDailyInEth: Influx.FieldType.FLOAT,
        estDailyUSD: Influx.FieldType.FLOAT,
        ethUsd: Influx.FieldType.FLOAT,
        ethBtc: Influx.FieldType.FLOAT,
        zilBtc: Influx.FieldType.FLOAT,
        zilUsd: Influx.FieldType.FLOAT,
        actualDailyEth: Influx.FieldType.FLOAT,
        actualDailyZil: Influx.FieldType.FLOAT,
        actualDailyHashrate: Influx.FieldType.INTEGER,
      },
      tags: [],
    },
    {
      measurement: "flexpool",
      fields: {
        balance: Influx.FieldType.FLOAT,
        estDaily: Influx.FieldType.FLOAT,
      },
      tags: [],
    },
    {
      measurement: "ethermine",
      fields: {
        balance: Influx.FieldType.FLOAT,
        ethPerMin: Influx.FieldType.FLOAT,
        usdPerMin: Influx.FieldType.FLOAT,
      },
      tags: [],
    },
    {
      measurement: "f2pool",
      fields: {
        balance: Influx.FieldType.FLOAT,
      },
      tags: [],
    },
    {
      measurement: "hiveon",
      fields: {
        estDaily: Influx.FieldType.FLOAT,
        balance: Influx.FieldType.FLOAT,
      },
      tags: [],
    },
    {
      measurement: "binance",
      fields: {
        balance: Influx.FieldType.FLOAT,
      },
      tags: [],
    },
  ],
});
influx
  .getDatabaseNames()
  .then((names) => {
    if (!names.includes(database)) {
      return influx.createDatabase(database);
    }
  })
  .catch((err) => {
    console.error(`Error creating Influx database!`);
  });

let lastLogs = {} 

function shouldLog(log) {
  const { measurement, key, value } = log;
  const logKey = `${measurement}${key}`
  if (logKey in lastLogs && lastLogs[logKey] == value) {
    return false
  } 
  lastLogs[logKey] = value

  return true
}

function influxLog(logs) {
  console.log("toInflux", logs);
  logs.forEach((log) => {
    if (!shouldLog(log)) {
      console.log("Same Log")
      return
    }
    const { measurement, key, value } = log;
    influx
      .writePoints([
        {
          measurement,
          // tags: {},
          fields: { [key]: value },
        },
      ])
      .catch((err) => {
        console.log(`Error saving data to InfluxDB! ${err.stack}`);
      });
  });
}

module.exports = influxLog;
