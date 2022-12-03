const { seatsdata } = require("../../../models/mongoose");

const GetSeatStatus = async (req, res, next) => {
    try {

        coachNumber = req.query.coachNumber;

        if (coachNumber == '' || coachNumber == undefined) {
            const error = {
                status: 400,
                statusCode: "ERROR",
                message: "Please select the CoachNumber"
            }
            throw error;
        }

        const seatsData = await seatsdata.findOne({ coachNumber: coachNumber })
        if (seatsData == '' || seatsData == undefined) {
            const error = {
                status: 404,
                statusCode: "ERROR",
                message: "There is no such coach available."
            }
            throw error;
        }
        resp = []
        var seatsArray = seatsData.seatsStatus
        Object.keys(seatsArray).forEach(function (key) {
            resp.push({
                seatnumber: Number(key),
                status: seatsArray[key]
            });

        });
        res.send({
            status: 200,
            statusCode: "SUCCESS",
            message: "Seats Status Fetched Successfully :).",
            data: {
                coachNumber: seatsData.coachNumber,
                totalSeats: seatsData.totalSeats,
                seatsStatus: resp
            }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = GetSeatStatus