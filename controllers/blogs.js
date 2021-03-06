const mongoose = require("mongoose");
const slugify = require("slugify");
const uniqueSlug = require("unique-slug");
const { getAccessToken, getAuth0User } = require("./auth");

const Blog = mongoose.model("Blog");

exports.getBlogs = async (req, res) => {
	const blogs = await Blog.find({ status: "published" }).sort({
		createdAt: -1,
	});
	const { access_token } = await getAccessToken();
	const blogsWithUser = [];
	const authours = {};

	for (let blog of blogs) {
		const authour =
			authours[blog.user_id] || (await getAuth0User(access_token, blog.userId));
		authours[authour.user_id] = authour;
		blogsWithUser.push({ blog, authour });
	}
	return res.json(blogsWithUser);
};

exports.getBlogsByUser = async (req, res) => {
	const userId = req.user.sub;
	const blogs = await Blog.find({
		userId,
		status: { $in: ["draft", "published"] },
	});
	return res.status(200).json(blogs);
};

exports.getBlogById = async (req, res) => {
	const blog = await Blog.findById(req.params.id);
	return res.json(blog);
};

exports.getBlogBySlug = async (req, res) => {
	const blog = await Blog.findOne({ slug: req.params.slug });
	const { access_token } = await getAccessToken();
	const authour = await getAuth0User(access_token, blog.userId);

	return res.json({ blog, authour });
};

exports.createBlog = async (req, res) => {
	const blogData = req.body;
	blogData.userId = req.user.sub; //"amouremFunem@btinternet.com";
	const blog = new Blog(blogData);
	try {
		const createdBlog = await blog.save();
		return res.json(createdBlog);
	} catch (e) {
		return res.status(422).send(e.message);
	}
};

const _saveBlog = async (blog) => {
	try {
		const createdBlog = await blog.save();
		return createdBlog;
	} catch (e) {
		if (e.code === 11000 && e.keyPattern && e.keyPattern.slug) {
			blog.slug += `-${uniqueSlug()}`;
			return _saveBlog(blog);
		}
		throw e;
	}
};

exports.updateBlog = async (req, res) => {
	const {
		body,
		params: { id },
	} = req;

	Blog.findById(id, async (err, blog) => {
		if (err) {
			return res.status(422).send(err.message);
		}

		//TODO: if user publishing - create slug
		if (body.status && body.status === "published" && !blog.slug) {
			// looking to publish a blog
			blog.slug = slugify(blog.title, {
				replacement: "-",
				lower: true,
			});
		}
		blog.set(body);
		blog.updateAt = new Date();
		try {
			const updatedBlog = await _saveBlog(blog);
			return res.status(201).json(updatedBlog);
		} catch (e) {
			return res.status(422).send(e.message);
		}
	});
};
