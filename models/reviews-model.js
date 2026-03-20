import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true
  },

  email: {
    type: String
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },

  review: {
    type: String,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
