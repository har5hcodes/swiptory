const mongoose = require("mongoose");

const slideSchema = new mongoose.Schema({
  slideNumber: {
    type: Number,
    required: true,
  },
  header: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  likes: {
    type: Array,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Slide", slideSchema);
