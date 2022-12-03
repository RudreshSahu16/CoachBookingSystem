const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BookingDetailsSchema = new Schema({
    coachNumber: { type: Number },
    totalSeats: { type: Number },
    seatBooked: { type: Array, },
    userName: { type: String },

},
    { timestamps: true }
);

const bookingDetails = mongoose.model("seats_booking_details", BookingDetailsSchema);

module.exports = bookingDetails;
