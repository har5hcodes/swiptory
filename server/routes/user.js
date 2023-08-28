const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const Slide = require("../models/slide");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.post("/addBookmark", requireAuth, async (req, res) => {
  try {
    const { slideId } = req.body;
    const userId = req.user;

    if (!userId || !slideId) {
      return res
        .status(400)
        .json({ error: "Both userId and slideId are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.bookmarks.push(slideId);

    await user.save();

    res.status(200).json({ message: "Bookmark added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/removeBookmark", requireAuth, async (req, res) => {
  try {
    const { slideId } = req.body;
    const userId = req.user;

    if (!userId || !slideId) {
      return res
        .status(400)
        .json({ error: "Both userId and slideId are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.bookmarks = user.bookmarks.filter(
      (bookmark) => bookmark.toString() !== slideId
    );

    await user.save();

    res.status(200).json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/like", requireAuth, async (req, res) => {
  try {
    const { slideId } = req.body;
    const userId = req.user;

    if (!userId || !slideId) {
      return res
        .status(400)
        .json({ error: "Both userId and slideId are required" });
    }

    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ error: "Slide not found" });
    }

    if (slide.likes.includes(userId)) {
      slide.likes = slide.likes.filter((like) => like.toString() !== userId);
      await slide.save();
      return res.status(200).json({
        message: "Slide unliked successfully",
        likeCount: slide.likes.length,
        likeStatus: false,
      });
    }

    slide.likes.push(userId);

    await slide.save();

    res.status(200).json({
      message: "Slide liked successfully",
      likeCount: slide.likes.length,
      likeStatus: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/posts", requireAuth, async (req, res) => {
  const { filters } = req.body;
  try {
    const userId = req.user;

    let filteredPosts;

    if (filters.includes("All")) {
      filteredPosts = await Post.find({ postedBy: userId }).populate({
        path: "slides",
        match: {},
      });
    } else {
      filteredPosts = await Post.find({ postedBy: userId }).populate({
        path: "slides",
        match: { category: { $in: filters } },
      });
    }

    filteredPosts = filteredPosts.filter((post) => post.slides.length > 0);

    res.status(200).json({ posts: filteredPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/bookmarks", requireAuth, async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById(userId).populate("bookmarks");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const bookmarks = user.bookmarks.map((bookmark) => {
      const slide = bookmark;
      return {
        slides: [slide],
      };
    });

    res.status(200).json({ bookmarks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/isBookmarked/:slideId", requireAuth, async (req, res) => {
  try {
    const { slideId } = req.params;
    const userId = req.user;

    if (!userId || !slideId) {
      return res
        .status(400)
        .json({ error: "Both userId and slideId are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isBookmarked = user.bookmarks.includes(slideId);

    res.status(200).json({ isBookmarked });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
