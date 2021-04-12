const ErrorResponse = require('../utils/errorResponse')
const asyncHandler = require('../middleware/async')
const Course = require('../models/Course')
const Bootcamp = require('../models/Bootcamp')

// @desc get courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({
      bootcamp: req.params.bootcampId,
    })
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    })
  } else {
    res.status(200).json(res.advancedResults)
  }
})

// @desc get single course
// @route GET /api/v1/courses/:id
// @access public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description',
  })

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found with id ${req.params.id}`,
        404
      )
    )
  }

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc Add a course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.createCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootcamp = await Bootcamp.findById(req.params.bootcampId)

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp found with id ${req.params.bootcampId}`,
        404
      )
    )
  }

  //Make sure user is Bootcamp owner
  if (
    bootcamp.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp.id}`,
        401
      )
    )
  }

  req.body.user = req.user.id

  const course = await Course.create(req.body)

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc update single course
// @route PUT /api/v1/courses/:id
// @access public
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found with id ${req.params.id}`,
        404
      )
    )
  }

  //Make sure user is course owner
  if (
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update course ${course.id}`,
        401
      )
    )
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: course,
  })
})

// @desc delete single course
// @route DELETE /api/v1/courses/:id
// @access private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  if (!course) {
    return next(
      new ErrorResponse(
        `No course found with id ${req.params.id}`,
        404
      )
    )
  }

  //Make sure user is course owner
  if (
    course.user.toString() !== req.user.id &&
    req.user.role !== 'admin'
  ) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete course ${course.id}`,
        401
      )
    )
  }

  await course.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
