const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  prdCategory: {
    type: String,
    required: true,
    enum: ["Rent", "Buy"],
  },
  images: {
    type: [String],
    required: true,
  },
  prdIndustry: {
    type: String,
    required: true,
    enum: ["Construction", "Quarry & Aggregate","Mining","Oil & Gas"],
  },
  prdCondition: {
    type: String,
    required: true,
    enum: ["Brand New", "Used"],
  },
  prdBrand: {
    type: String,
    required: true,
  },
  prdType: {
    type: String,
    required: true,
    enum: ["Off Road Trucks", "Excavators","Crawler Cranes","Crawler Dozers","Wheel Loaders","Compactors"],
  },
  ref_number: {
    type: String,
  },
  opr_weight: {
    type: String,
  },
  manufacture: {
    type: String,
  },
  workingHours: {
    type: String,
  },
  cabType: {
    type: String,
  },
  engineMake: {
    type: String,
  },
  enginePower: {
    type: String,
  },
  fuelCapacity: {
    type: String,
  },
  productColor: {
    type: String,
  },
  shortDescription: {
    type: String,
  },
  longDescription: {
    type: String,
  },
  createdAt:{
    type: Date,
    default: Date.now,
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
