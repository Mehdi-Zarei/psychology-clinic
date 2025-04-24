const schedule = require("node-schedule");
const bookingModel = require("../model/Booking");

const IS_TEST_MODE = false;

const setBookingJob = (booking) => {
  booking.time.forEach((slot) => {
    const originalEndTime = new Date(slot.endTime);
    const now = new Date();

    if (originalEndTime <= now) return;

    const jobTime = IS_TEST_MODE
      ? new Date(now.getTime() + 60 * 1000)
      : new Date(originalEndTime.getTime() + 5 * 60 * 1000);

    const jobName = `booking-${booking._id.toString()}-slot-${slot._id.toString()}`;

    schedule.scheduleJob(jobName, jobTime, async () => {
      try {
        const result = await bookingModel.updateOne(
          {
            _id: booking._id,
            "time._id": slot._id,
          },
          {
            $set: { "time.$.status": "done" },
          }
        );

        if (result.modifiedCount > 0) {
          console.log(
            `✅ Slot ${slot._id} for booking ${booking._id} set to done`
          );
        } else {
          console.warn(`⚠️ Slot ${slot._id} was not updated`);
        }
      } catch (err) {
        console.error(`❌ Failed to update slot ${slot._id}:`, err.message);
      }
    });
  });
};

module.exports = setBookingJob;
