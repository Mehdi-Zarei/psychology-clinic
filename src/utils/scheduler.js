const bookingModel = require("../model/Booking");
const setBookingJob = require("./setBookingJob");

const loadBookingJobs = async () => {
  try {
    const now = new Date();

    const bookings = await bookingModel.find({
      time: {
        $elemMatch: {
          endTime: { $gt: now },
          status: "reserved",
        },
      },
    });

    if (bookings.length === 0) {
      console.log("ℹ️ No upcoming booking slots to schedule");
      return;
    }

    console.log(`🗓 Scheduling jobs for ${bookings.length} booking(s)...`);

    bookings.forEach((booking) => {
      setBookingJob(booking);
    });
  } catch (err) {
    console.error("❌ Error loading booking jobs:", err.message);
  }
};

module.exports = loadBookingJobs;
