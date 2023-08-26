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

// const fetchYourStories = async () => {
//   try {
//     const response = await fetch(
//       `${process.env.REACT_APP_BACKEND_URL}/api/user/posts`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ filters: props.selectedFilters }),
//       }
//     );
//     if (response.ok) {
//       const data = await response.json();
//       setCategoryStories(data.posts);
//     } else {
//       console.error("Failed to fetch your stories");
//     }
//   } catch (error) {
//     console.error("Error fetching your stories:", error);
//   }
// };

router.post("/posts", requireAuth, async (req, res) => {
  const { filters } = req.body;
  console.log(filters);

  try {
    const userId = req.user;

    if (filters.length > 0 && filters[0] === "All") {
      const posts = await Post.find({ postedBy: userId }).populate("slides");
      return res.status(200).json({ posts });
    }

    // Find the posts by the user
    const posts = await Post.find({ postedBy: userId });

    // Collect all slide IDs from the matching posts
    const slideIds = posts.flatMap((post) => post.slides);

    // Filter slides based on the selected categories
    const filteredSlides = await Slide.find({
      _id: { $in: slideIds },
      category: { $in: filters },
    });

    // Populate the filtered slides back into the matching posts
    const populatedPosts = posts.map((post) => {
      return {
        ...post.toObject(),
        slides: filteredSlides.filter((slide) =>
          post.slides.includes(slide._id)
        ),
      };
    });

    return res.status(200).json({ posts: populatedPosts });
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

    const posts = user.bookmarks.map((bookmark) => {
      const slide = bookmark;
      return {
        slides: [slide],
      };
    });

    res.status(200).json({ posts });
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
