const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  author: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    validate(value) {
      if (value < 0) {
        throw new Error("Price must be a postive number");
      }
    },
  },
  saveDate: {
    type: Date,
    default: Date.now,
  },
});

BookSchema.statics.create = function (payload) {
  const book = new this(payload);
  return book.save();
};

BookSchema.statics.findAll = function () {
  return this.find({});
};

// BookSchema.statics.findById = function (_id) {
//   return this.findById(_id);
// };

BookSchema.statics.updateBookById = function (_id, payload) {
  return this.findByIdAndUpdate(_id, payload, { new: true });
};

BookSchema.statics.deleteBookById = function (_id) {
  return this.findByIdAndDelete(_id);
};

const Book = mongoose.model("Book", BookSchema);

module.exports = Book;
