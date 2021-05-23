import Review from '../models/reviews.model.js';

const create = async (req, res) => {
  let review = req.body;
  review.username = req.user._json.email;

  if (!review) {
    return res.status(404).send({
      error: "Review not found",
    });
  }
  await new Review(review).save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send(err);
    });
};

const getAllReviews = async (req, res) => {
  await Review.find()
    .then(reviews => res.json(reviews))
    .catch(err => res.status(500).json('Error: ' + err));
};

const getAverageRatingsForAllBusinesses = async (req, res) => {
  await Review.aggregate(
      [{
        $group: {
          _id: {
            address: "$address",
            lat: "$lat",
            lng: "$lng"
          },
          avg_mask_rating: {
            $avg: "$mask_usage"
          },
          avg_social_distance_rating: {
            $avg: "$social_distance"
          },
          avg_sanitization_rating: {
            $avg: "$sanitized"
          }
        }
      }]
    )
    .then(ratings => res.json(ratings))
    .catch(err => res.status(500).json('Error: ' + err))
};

const deleteAll = async (req, res) => {
  await Review.deleteMany({})
    .catch(err => res.status(500).json('Error: ' + err));
};

export default {
  create,
  getAllReviews,
  getAverageRatingsForAllBusinesses,
  deleteAll
};