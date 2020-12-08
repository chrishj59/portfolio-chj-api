const { portfolios, blogs } = require("./data");
const Portfolio = require("../db/models/portfolio");
const blog = require("../db/models/blog");

class FakeDB {
	async clean() {
		await Portfolio.deleteMany({});
		await blog.deleteMany;
	}
	async addData() {
		await Portfolio.create(portfolios);
		await blog.create(blogs);
	}
	async populate() {
		await this.clean();
		await this.addData();
	}
}

module.exports = new FakeDB();
