const mongoose = require("mongoose");

const mongoClient = async () => {
    try {
        console.log(process.env.MONGO_URL, process.env.MONGO_DATABASE_NAME)
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            dbName: process.env.MONGO_DATABASE_NAME,
        });
        console.log(`Mongodb connected ${conn.connection.host}`);
    } catch (error) {
        process.exit(1);
    }
};

module.exports = mongoClient;
