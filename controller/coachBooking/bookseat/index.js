const { seatsdata, bookingDetails } = require("../../../models/mongoose");

const BookSeats = async (req, res, next) => {
    try {
        console.log("booking for seat started")
        seatsRequired = req.body.seatsRequired
        coachNumber = req.body.coachNumber
        userName = req.body.name

        // check for coach Number not be empty
        if (coachNumber == '' || coachNumber == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Coach Number not selected."
            }
            throw error;
        }
        // check for Username not to be empty
        if (userName == '' || userName == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Please Enter the name."
            }
            throw error;
        }

        // checking seat required not to be null
        if (seatsRequired == '' || seatsRequired == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Please enter number of seat required"
            }
            throw error;
        }


        // checking for seat limit should be less than or equal to 7 or greater than 0
        if (seatsRequired < 0 || seatsRequired > 7) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "please Enter valid number of seats(minimum should be 1 and maximum should be 7)."
            }
            throw error;
        }

        // find in seats statuses of given coach
        coachData = await seatsdata.findOne({ coachNumber: coachNumber })
        const seatsData = await seatsdata.findOne(req.query)

        // check for coach data not to be empty
        if (seatsData == '' || seatsData == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "There is no such coach available"
            }
            throw error;
        }

        // seat Allocation Algo. for allocating seat to user
        seatArray = coachData.seatBooked
        seatStatus = coachData.seatsStatus
        bookedseats = seatArray
        temp = []
        seatArraylength = seatArray.length
        // for continuous seat allocation
        for (var i = 0, len = seatArraylength; i < len - 1; i++) {
            seatArrayRowlength = seatArray[i].length
            if (7 - seatArrayRowlength >= seatsRequired) {
                count = 0
                for (var j = (7 * i) + 1; j < 7 * (i + 1) + 1; j++) {
                    if (seatArray[i].includes(j)) {
                        count = 0
                        if (temp.length == seatsRequired) {
                            break;
                        }
                        else {
                            temp = [];
                        }

                    }
                    else {
                        count += 1
                        temp.push(j)
                        if (temp.length == seatsRequired) {
                            break;
                        }
                    }
                }

                if (temp.length != seatsRequired) {
                    count = 0
                    temp = []
                }


                if (count == seatsRequired) {
                    // allot seats
                    seatArray[i] = [...seatArray[i], ...temp]
                    seatArray[i].sort()
                    break;

                }
            }
        }
        // allcating seat present with booked seats in a row 
        if (seatsRequired <= 3 && temp.length != seatsRequired) {

            limit = (7 * ((seatArraylength) - 1))
            lastindex = seatArray[seatArray.length - 1].length

            if (Math.abs(lastindex - 1) <= 3 && Math.abs(lastindex - 1) == seatsRequired) {

                for (k = (limit + 1 + lastindex); k < (limit + 1 + seatsRequired + lastindex); k++) {
                    temp.push(k)
                }

            }
        }
        // minimum distance seat
        if ((temp.length) != seatsRequired) {

            count = 0
            for (i = 0; i < seatArraylength; i++) {
                if ((seatArrayRowlength) < 7) {
                    for (var seat = ((7 * i) + 1); seat < (7 * (i + 1) + 1); seat++) {
                        if (seat <= 80) {
                            if (!seatArray[i].includes(seat)) {
                                if (count < seatsRequired) {
                                    count += 1
                                    temp.push(seat)
                                }
                                else {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            // checking for all seat is booked or not
            if (temp.length == 0) {
                const error = {
                    status: 200,
                    statusCode: 'FAILURE',
                    message: "Oppps....All Seats Are full."
                }
                throw error;

            }

            // check if allocating seat should be equal to required seats to book
            if (temp.length != seatsRequired) {
                const error = {
                    status: 200,
                    statusCode: 'WARNING',
                    message: "Sorry not able to book all " + String(seatsRequired) + " seats you want.Only " + String(temp.length) + " seats left"
                }
                throw error;
            }
        }
        // changing status of seat Vacant to Booked state
        temp.map(item => {
            seatStatus[item] = 'Booked'
        })
        // arranging data that to be share
        result = {
            coachNumber: coachNumber,
            userName: userName,
            seatBooked: temp,
            totalSeats: 80
        }

        // updating seats statuses to data base colllections
        const bookingDetail = new bookingDetails(result);
        const bookingData = await bookingDetail.save();
        const seatsChecks = await seatsdata.findByIdAndUpdate({ _id: coachData._id }, { 'seatsStatus': seatStatus, 'seatBooked': bookedseats }, { new: true });

        // debuger
        console.log("fianl result", seatsChecks);

        // sending required data to client request through API response
        res.send({
            status: 200,
            statusCode: 'SUCCESS',
            message: "Hurrayyy!!! Your Seat Has Been Booked At Seat Number",
            data: {
                coachNumber: seatsChecks.coachNumber,
                totalSeats: seatsChecks.totalSeats,
                seatsStatus: seatsChecks,
            },
            BookedSeats: temp,
        });

    } catch (error) {
        // debuger
        console.log(error);
        next(error);
    }
};

module.exports = BookSeats