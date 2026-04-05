const reviewModel = require('../models/ReviewsModel')

const createReview = async (req, res) => {
  try {
    const { 
      name, 
      designation, 
      quote, 
      review, 
      nameHi, 
      designationHi, 
      quoteHi, 
      reviewHi, 
      rating 
    } = req.body;

    if (
      !name || !designation || !quote || !review ||
      !nameHi || !designationHi || !quoteHi || !reviewHi ||
      !rating
    ) {
      return res.status(400).json({ status: false, msg: "All fields are required" });
    }

    await reviewModel.create({
      name,
      designation,
      quote,
      review,
      nameHi,
      designationHi,
      quoteHi,
      reviewHi,
      rating
    });

    return res.status(200).json({
      status: true,
      msg: "Review created successfully",
    });

  } catch (err) {
    console.error("Error creating review:", err);
    return res.status(500).json({
      status: false,
      msg: "Error creating review",
    });
  }
};



const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({
      status: true,
      data: reviews || []
    });
  } catch (error) {
    console.error('Reviews error:', error);
    res.status(200).json({ status: true, data: [] }); // 🛡️ Graceful
  }
};

module.exports = {
  createReview,
  getAllReviews
};