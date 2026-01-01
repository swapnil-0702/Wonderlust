const mongoose = require("mongoose");
const review = require("./review");
const { ref } = require("joi");
const Schema = mongoose.Schema;  // ✅ This line fixes the error
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",
    },
  },
  price: {
  type: Number,
  required: true
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
});

listingSchema.post("findOneAndDelete" , async(Listing) => {
  if(Listing) {
    await Review.deleteMany({ _id: { $in: Listing.reviews }});
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
