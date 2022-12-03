const express = require("express");
const createError = require("http-errors");
const { mongoClient } = require("./helpers/connections")
const { coachSeatBookingRouter } = require("./routes")
const cors = require("cors");


const dotenv = require("dotenv");
dotenv.config();


mongoClient();
const app = express();
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: '*' }));


app.get("/", async (req, res, next) => {
    res.send("Welcome to Coach Seat Booking Project :)");
});

app.use('/seatBooking', coachSeatBookingRouter);

app.use(async (req, res, next) => {
    next(createError.NotFound("This route does not exist"));
});

app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        statusCode: err.statusCode || "FAILURE",
        status: err.status || 500,
        message: err.message,
    },
    );
});


const Port = process.env.PORT;
app.listen(Port, () => {
    console.log(` Server running onm Port ${Port}`)
});