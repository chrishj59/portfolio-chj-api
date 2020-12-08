const mongoose = require("mongoose");
const Portfolio = mongoose.model("Portfolio");

exports.getPortfolios = async (req, res) => {
	const portfolios = await Portfolio.find({});
	return res.json(portfolios);
};

exports.getPortfolioById = async (req, res) => {
	try {
		const portfolio = await Portfolio.findById(req.params.id);
		return res.json(portfolio);
	} catch (err) {
		return res.status(422).json(err.message);
	}
};

exports.createPortfolio = async (req, res) => {
	console.log("Create portfolio called");
	const portfolioData = req.body;
	const userId = req.user.sub; // user id from auth0
	const portfolio = new Portfolio(portfolioData);
	portfolio.userId = userId;
	try {
		const newPortfolio = await portfolio.save();
		return res.json(newPortfolio);
	} catch (error) {
		return res.status(422).send(error.message);
	}

	res.json({ message: "Create portfolio from 3001" });
};

exports.updatePortfolio = async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	try {
		const updatedPortfolio = await Portfolio.findOneAndUpdate(
			{ _id: id },
			body,
			{ new: true, runValidators: true }
		);
		return res.status(201).json(updatedPortfolio);
	} catch (e) {
		return res.status(420).json(e.message);
	}
};

exports.deletePortfolio = async (req, res) => {
	try {
		const deletedPortfolio = await Portfolio.findOneAndRemove({
			_id: req.params.id,
		});
		console.log({ _id: deletedPortfolio.id });
		return res.json({ _id: deletedPortfolio.id });
	} catch (e) {
		return res.status(420).json(e.message);
	}
};
