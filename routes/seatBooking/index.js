const express = require("express");
const { GetSeatStatus, BookSeats } = require("../../controller")

const coachSeatBookingRouter = express.Router();

coachSeatBookingRouter.get("/getSeatStatus", GetSeatStatus);
coachSeatBookingRouter.post("/bookSeat", BookSeats);

module.exports = coachSeatBookingRouter;
