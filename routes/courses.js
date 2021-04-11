const express = require('express')
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  //   getBootcamp,
  //   createBootcamp,
  //   updateBootcamp,
  //   deleteBootcamp,
  //   getBootcampsInRadius,
} = require('../controllers/courses')

const Course = require('../models/Course')
const advancedResults = require('../middleware/advancedResults')

const router = express.Router({ mergeParams: true })

const { protect } = require('../middleware/auth')

router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getCourses
  )
  .post(protect, createCourse)

router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse)
// .post(createBootcamp)

// router
//   .route('/:id')
//   .get(getBootcamp)
//   .put(updateBootcamp)
//   .delete(deleteBootcamp)

// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

module.exports = router
