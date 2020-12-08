const config = require("../config");
const mongoose = require("mongoose");

require("./models/portfolio");
require("./models/blog");

exports.connect = async () => {
	let db = null;
	try {
		db = await mongoose.connect(
			config.DB_URI,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false,
			}
			// ,
			// (err) => {
			// 	if (err) {
			// 		console.log("error", err);
			// 	} else {
			// 		console.log("cB DB connected!!");
			// 	}
			// }
		);
		console.log("DB connected!!");
		return db;
	} catch (err) {
		console.log("could not connect ", err);
	}
};
