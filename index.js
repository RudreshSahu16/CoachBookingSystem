const express = require("express");
const createError = require("http-errors");
const { mongoClient } = require("./helpers/connections")
const { coachSeatBookingRouter } = require("./routes")
const cors = require("cors");


const dotenv = require("dotenv");
dotenv.config();

// connecting mongo db to project
mongoClient();
const app = express();
app.use(express.json());


app.use(express.urlencoded({ extended: true }));
// putting core origin to be access
app.use(cors({ origin: '*' }));

// checking for health status of webservices
app.get("/", async (req, res, next) => {
    res.send("Welcome to Coach Seat Booking Project :)");
});

// routing
app.use('/seatBooking', coachSeatBookingRouter);

// managing route handelling
app.use(async (req, res, next) => {
    next(createError.NotFound("This route does not exist"));
});

// Maintaing error handling
app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        statusCode: err.statusCode || "FAILURE",
        status: err.status || 500,
        message: err.message,
    },
    );
});


// for port Listening 
const Port = 9001
app.listen(Port, () => {
    console.log(` Server running onm Port ${Port}`)
});
