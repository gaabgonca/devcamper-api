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
  },
})

CourseSchema.set('timestamps', true)

//Add course to random bootcamp if bootcamp id not provided

CourseSchema.pre('save', async function (next) {
  if (!this.bootcamp) {
    const Bootcamps = await this.model('Bootcamp').find()
    // Select random one
    const randomBootcamp =
      Bootcamps[Math.floor(Math.random() * Bootcamps.length)]

    this.bootcamp = randomBootcamp._id
  }

  next()
})

//Static method to get average of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
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
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(agg[0].averageCost / 10) * 10,
    })
  } catch (err) {
    console.log(err)
  }
}

// Call getAverageCost after save

CourseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp)
})

// Call getAverageCost before remove

CourseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp)
})

module.exports = mongoose.model('Course', CourseSchema)
