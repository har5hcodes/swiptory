const express = require("express");
const Slide = require("../models/slide");
const requireAuth = require("../middlewares/requireAuth");

const router = express.Router();

router.get("/slideDetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const slide = await Slide.findById(id);
    if (!slide) {
      return res.status(404).send({ error: "Slide not found" });
    }
    res.status(200).json({ slide });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
