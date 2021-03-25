const express = require('express')
const {
  getCourses,
  //   getBootcamp,
  //   createBootcamp,
  //   updateBootcamp,
  //   deleteBootcamp,
  //   getBootcampsInRadius,
} = require('../controllers/courses')

const router = express.Router({ mergeParams: true })

router.route('/').get(getCourses)
// .post(createBootcamp)

// router
//   .route('/:id')
//   .get(getBootcamp)
//   .put(updateBootcamp)
//   .delete(deleteBootcamp)

// router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius)

module.exports = router
