const mongoose = require("mongoose");
let articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});
let article = (module.exports = mongoose.model("Article", articleSchema));
