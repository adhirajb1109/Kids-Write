const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");
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
articleSchema.plugin(mongoosePaginate);
let article = (module.exports = mongoose.model("Article", articleSchema));
