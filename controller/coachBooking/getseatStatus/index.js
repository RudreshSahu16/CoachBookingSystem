const { seatsdata } = require("../../../models/mongoose");

const GetSeatStatus = async (req, res, next) => {
    try {
        // debuger
        console.log('get seat status route started')

        coachNumber = req.query.coachNumber;
        //CHECK FOR CoachNumber
        if (coachNumber == '' || coachNumber == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Please select the CoachNumber"
            }
            throw error;
        }

        const seatsData = await seatsdata.findOne({ coachNumber: coachNumber })

        // Check for coach availablity
        if (seatsData == '' || seatsData == undefined) {
            const error = {
                status: 404,
                statusCode: "ERROR",
                message: "There is no such coach available."
            }
            throw error;
        }

        resp = []

        // puttind data of coach to ready state
        var seatsArray = seatsData.seatsStatus
        Object.keys(seatsArray).forEach(function (key) {
            resp.push({
                seatnumber: Number(key),
                status: seatsArray[key]
            });

        });
        // debugger
        console.log("final check ", data);
        // sending response to client side as API response
        res.send({
            status: 200,
            statusCode: "SUCCESS",
            message: "Seats Status Fetched Successfully.",
            data: {
                coachNumber: seatsData.coachNumber,
                totalSeats: seatsData.totalSeats,
                seatsStatus: resp
            }
        });

    } catch (error) {
        // debugger
        console.log(error);
        next(error);
    }
};

module.exports = GetSeatStatus