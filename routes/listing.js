const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const { listingSchema } = require("../schema.js");
const wrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError");

const validateListing  = (req,res,next)=>{
  let {error} = listingSchema.validate(req.body);
  if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,error);
  }else{
    next();
  }
};

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
      req.flash("error","No listing found");
      return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

//Create Route
router.post(
  "/", validateListing,
  wrapAsync(async (req, res, next) => {
    // let result  = listingSchema.validate(req.body);
    // console.log(result); to checks whats in error
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","No listing found");
      return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
  })
);

//Update route
router.put(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;