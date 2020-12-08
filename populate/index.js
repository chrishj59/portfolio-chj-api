const config = require("../config");
const mongoose = require("mongoose");
const fakeDB = require("./FakeDB");

mongoose.connect(
	config.DB_URI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	},
	async (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("> start populating DB....");
			await fakeDB.populate();
			mongoose.connection.close();
			console.log("> DB has been populated!!");
		}
	}
);
//
// } catch (err) {
// 	console.log("could not connect ", err);
// }
