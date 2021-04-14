const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Review = require('../models/Review')
const Bootcamp = require('../models/Bootcamp')

// @desc get reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    })
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc get single review
// @route GET /api/v1/reviews/:id
// @access public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with id ${req.params.id}`,
        404
      )
    )
  }

  res.status(202).json({
    success: true,
    data: review,
  })
})

// @desc Add review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    )
  }

  const review = await Review.create(req.body)

  res.status(201).json({
    success: true,
    data: review,
  })
})

// @desc Update review
// @route PUT /api/v1/reviews/:id
// @access public
exports.updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with id ${req.params.id}`,
        404
      )
    )
  }

  //Make sure review belongs to user or user is admin
  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update review ${review.id}`,
        401
      )
    )
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  })

  res.status(202).json({
    success: true,
    data: review,
  })
})

// @desc Delete review
// @route PUT /api/v1/reviews/:id
// @access public
exports.deleteReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(
      new ErrorResponse(
        `No review found with id ${req.params.id}`,
        404
      )
    )
  }

  //Make sure review belongs to user or user is admin
  if (
    review.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete review ${review.id}`,
        401
      )
    )
  }

  await Review.findByIdAndRemove(req.params.id)

  res.status(202).json({
    success: true,
    data: {},
  })
})
