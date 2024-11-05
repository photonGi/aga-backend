const express = require("express");
const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("../models/product");
const Interest = require("../models/interest");
const Client = require("../models/client");
const router = express.Router();


router.post("/authAdminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(401).json({ message: "User not found" });
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: checkUser.email, id: checkUser._id },  // Include user's ID for token payload
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }  // Optional: Set token expiration time
    );

    return res.status(200).json({ data: token, message: "Login Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/authAddUser", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    user.save();

    res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/checkUserFT", async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await Client.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { email: checkUser.email, id: checkUser._id },  // Include user's ID for token payload
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2h" }  // Optional: Set token expiration time
    );

    return res.status(200).json({ data: token, name: checkUser.name, id:checkUser._id, message: "Login Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/createUserFT", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const checkUser = await Client.findOne({ email });
    if (checkUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await Client.create({
      name,
      email,
      password: hashPassword,
    });

    user.save();

    res.status(200).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addInterest", async (req, res) => {
  try {
    const { productId, userId, comment } = req.body;

    if (!productId || !userId || !comment) {
      console.log("Missing fields:", { productId, userId, comment });
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const interest = await Interest.create({
      productId,
      userId,
      comment,
    });
    res.status(200).json({ message: "Interest added successfully." });
  } catch (error) {
    // Log the error for debugging
    console.error("Error adding interest:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.get('/getAllInterests', async (req, res) => {
  try {
    const interests = await Interest.find().populate('userId').populate('productId');
    res.status(200).json({interests});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getInterestById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const interest = await Interest.findById(id).populate('userId').populate('productId');
    if (!interest) {
      return res.status(404).json({ message: "Interest not found" });
    }
    res.status(200).json(interest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/deleteInterest/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInterest = await Interest.findByIdAndDelete(id);
    if (!deletedInterest) {
      return res.status(404).json({ message: "Interest not found" });
    }
    res.status(200).json({ message: "Interest deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getAllProducts", async (req, res) => {
  try {
    const products = await Product.find({});
    
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getProductById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/updateProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: "Update failed, product not found." });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/addProduct", async (req, res) => {
  try {
    const {
      title,
      prdCategory,
      images,
      prdIndustry,
      prdCondition,
      prdBrand,
      prdType,
      ref_number,
      opr_weight,
      manufacture,
      workingHours,
      cabType,
      engineMake,
      enginePower,
      fuelCapacity,
      productColor,
      shortDescription,
      longDescription,
    } = req.body;

    if (!title || !prdCategory || !prdBrand) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    const product = await Product.create({
      title,
      prdCategory,
      images,
      prdIndustry,
      prdCondition,
      prdBrand,
      prdType,
      ref_number,
      opr_weight,
      manufacture,
      workingHours,
      cabType,
      engineMake,
      enginePower,
      fuelCapacity,
      productColor,
      shortDescription,
      longDescription,
    });

    res.status(200).json({ message: "Product added successfully.", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: error.message });
  }
});

router.delete("/deleteProduct/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
