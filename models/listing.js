const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        require: true
    },
    description: String,
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/1448381278/photo/the-side-view-of-a-large-gray-craftsman-new-construction-house-with-a-landscaped-yard-a-three.jpg?s=1024x1024&w=is&k=20&c=qP71Hbz2mR4BhLC-rH8SI26Ifb89V5UNW_i1YjKjrgE=",
        set: (v) =>
             v === "" 
                ? "https://media.istockphoto.com/id/1448381278/photo/the-side-view-of-a-large-gray-craftsman-new-construction-house-with-a-landscaped-yard-a-three.jpg?s=1024x1024&w=is&k=20&c=qP71Hbz2mR4BhLC-rH8SI26Ifb89V5UNW_i1YjKjrgE=" 
                : v
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({_id : {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;