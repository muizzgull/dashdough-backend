import Review from "../models/reviews-model.js"

export const createReview = async (req, res) => {
    try {
        
        const {userName, email, rating, review} = req.body;

        if (!userName || !rating || !review) {
            return res.status(400).json({
                success: false,
              message: "Name, rating and review are required"
            });
          }

        const newReview = await Review.create({userName, email, rating, review})

        return res.status(201).json({
            success: true,
            message: "Review added successfully",
            review: newReview
          });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add review",
            error: error.message
          });
    }
}


export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({createdAt: -1})

        return res.status(200).json({
            success: true,
            reviews
        })
    } catch (error) {
        console.log(error.message)
        res.json({
            success: false,
            message: "could not fetch reviews",
            error: error.message})
    }
}
