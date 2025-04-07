const schedule = require("node-schedule");

const { getAndStoreRumours } = require("../jobs/getAndStoreRumours.js");

const jobScheduler = async () => {
  const startTime = new Date(new Date().setHours(0, 0, 0, 0));

  const oneMinuteRule = new schedule.RecurrenceRule();
  oneMinuteRule.second = 0;

  const oneHourRule = new schedule.RecurrenceRule();
  oneHourRule.hour = new schedule.Range(0, 23, 1);
  oneHourRule.minute = 0;
  oneHourRule.second = 0;

  schedule.scheduleJob(
    { start: startTime, rule: oneMinuteRule },
    async function () {
      console.log("The answer to life, the universe, and everything!");
      await getAndStoreRumours();
    }
  );
};

module.exports = { jobScheduler };
