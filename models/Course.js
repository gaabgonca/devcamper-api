const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    required: [true, 'Please add a course description'],
  },
  weeks: {
    type: String,
    required: [true, 'Please add a number of weeks'],
  },
  tuition: {
    type: Number,
    required: [true, 'Please add a tuition cost'],
  },
  minimumSkill: {
    type: String,
    required: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholarshipAvailable: {
    type: Boolean,
    default: false,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
})

CourseSchema.set('timestamps', true)

//Static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  console.log('Calculating average cost...'.blue)

  const agg = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ])
  console.log('aggregated done'.blue)
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(agg[0].averageCost / 10) * 10,
    })
  } catch (err) {
    console.log(err)
  }
}

// Call getAverageCost after save

CourseSchema.post('save', function (next) {
  this.constructor.getAverageCost(this.bootcamp)
  next()
})

// Call getAverageCost before remove

CourseSchema.pre('remove', function (next) {
  this.constructor.getAverageCost(this.bootcamp)
  next()
})

module.exports = mongoose.model('Course', CourseSchema)
