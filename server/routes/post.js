const express = require("express");
const Post = require("../models/post");
const Slide = require("../models/slide");
const requireAuth = require("../middlewares/requireAuth");
const router = express.Router();

router.get("/postDetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const existingPost = await Post.findById(id).populate("slides");
    res.status(200).send(existingPost);
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.post("/add", requireAuth, async (req, res) => {
  const { slides } = req.body;
  try {
    const slideObjects = slides.map((slideData, index) => {
      return new Slide({
        slideNumber: index + 1,
        header: slideData.header,
        description: slideData.description,
        imageUrl: slideData.imageUrl,
        likes: [],
        category: slideData.category,
      });
    });

    const createdSlides = await Slide.create(slideObjects);

    const post = new Post({
      slides: createdSlides.map((slide) => slide._id),
      postedBy: req.user,
    });

    await post.save();

    res.status(201).send({ message: "Post created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/edit/:id", requireAuth, async (req, res) => {
  const { slides: editedSlides } = req.body;
  const { id } = req.params;

  try {
    const existingPost = await Post.findById(id);

    await Slide.deleteMany({ _id: { $in: existingPost.slides } });

    const slideObjects = editedSlides.map((slideData, index) => {
      return new Slide({
        slideNumber: index + 1,
        header: slideData.header,
        description: slideData.description,
        imageUrl: slideData.imageUrl,
        likes: [],
        category: slideData.category,
      });
    });

    const createdSlides = await Slide.create(slideObjects);

    existingPost.slides = createdSlides.map((slide) => slide._id);
    await existingPost.save();

    res.status(200).send({ message: "Post updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.get("/:category", async (req, res) => {
  const { category } = req.params;

  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "slides",
          localField: "slides",
          foreignField: "_id",
          as: "slides",
        },
      },
      {
        $addFields: {
          slides: {
            $filter: {
              input: "$slides",
              as: "slide",
              cond: { $eq: ["$$slide.category", category] },
            },
          },
        },
      },
      {
        $match: {
          slides: { $ne: [] },
        },
      },
      {
        $project: {
          slides: 1,
          postedBy: 1,
        },
      },
    ]);

    res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
