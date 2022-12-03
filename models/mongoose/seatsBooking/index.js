const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeatBookSchema = new Schema({
    coachNumber: { type: Number },
    totalSeats: { type: Number },
    seatBooked: { type: Array, },
    seatsStatus: {
        type: Object
    }
},
    { timestamps: true }
);

const seatsdata = mongoose.model("coach_seats_booking", SeatBookSchema);

module.exports = seatsdata;
