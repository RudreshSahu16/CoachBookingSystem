const { seatsdata, bookingDetails } = require("../../../models/mongoose");

const BookSeats = async (req, res, next) => {
    try {
        seatsRequired = req.body.seatsRequired
        coachNumber = req.body.coachNumber
        userName = req.body.name


        if (coachNumber == '' || coachNumber == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Coach Number not selected."
            }
            throw error;
        }
        if (userName == '' || userName == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Please Enter the name."
            }
            throw error;
        }
        if (seatsRequired <= 0 || seatsRequired > 7) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "please Enter valid number of seats(minimum should be 1 and maximum should be 7)."
            }
            throw error;
        }
        if (seatsRequired == '' || seatsRequired == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Please enter number of seat required"
            }
            throw error;
        }


        coachData = await seatsdata.findOne({ coachNumber: coachNumber })
        const seatsData = await seatsdata.findOne(req.query)
        if (seatsData == '' || seatsData == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "There is no such coach available"
            }
            throw error;
        }
        seatArray = coachData.seatBooked
        seatStatus = coachData.seatsStatus
        bookedseats = seatArray
        temp = []
        seatArraylength = seatArray.length

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

        if (seatsRequired <= 3 && temp.length != seatsRequired) {

            limit = (7 * ((seatArraylength) - 1))
            lastindex = seatArray[seatArray.length - 1].length

            if (Math.abs(lastindex - 1) <= 3 && Math.abs(lastindex - 1) == seatsRequired) {

                for (k = (limit + 1 + lastindex); k < (limit + 1 + seatsRequired + lastindex); k++) {
                    temp.push(k)
                }

            }
        }
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
            if (temp.length == 0) {
                const error = {
                    status: 200,
                    statusCode: 'FAILURE',
                    message: "Oppps....All Seats Are full."
                }
                throw error;

            }
            if (temp.length != seatsRequired) {
                const error = {
                    status: 200,
                    statusCode: 'WARNING',
                    message: "Sorry not able to book all " + String(seatsRequired) + " seats you want.Only " + String(temp.length) + " seats left"
                }
                throw error;
            }
        }

        temp.map(item => {
            seatStatus[item] = 'Booked'
        })
        result = {
            coachNumber: coachNumber,
            userName: userName,
            seatBooked: temp,
            totalSeats: 80
        }

        const bookingDetail = new bookingDetails(result);
        const bookingData = await bookingDetail.save();
        const seatsChecks = await seatsdata.findByIdAndUpdate({ _id: coachData._id }, { 'seatsStatus': seatStatus, 'seatBooked': bookedseats }, { new: true });


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
        next(error);
    }
};

module.exports = BookSeats