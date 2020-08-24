const router = require('express').Router();
const User = require('../models/user.model');

router.route('/').get((req, res) => {
  let query = req.query.q;
  let search = req.query.s;
  let suggested = req.query.t;

  if(query) {
    User.find({'details.email': query})
    .then((response) => res.json(response))
  } else if (search) {
    let searchExp = new RegExp(search, 'i')
    let searchResponse = [];
    User.find({}, (err, response) => {
      if(err) {
        response.status(501).json({error: err});
        return;
      }
      let users = response;
      users.forEach(user => {
        let courses = user.courses;
        courses.forEach(course => {
          if (course.course_name.match(searchExp)
            || course.category.match(searchExp)
            || course.course_description.match(searchExp)
            || course.user_name.match(searchExp)) {
            searchResponse.push(course);
          }
        })
      })
      res.json(searchResponse)
    })
  } else if (suggested) {
    let searchResponse = [];

    User.find({}, (err, response) => {
      if(err) {
        response.status(501).json({error: err});
        return;
      }
      let users = response;
      users.forEach(user => {
        let courses = user.courses;
        (courses.length > 0) && (searchResponse = [...searchResponse, ...courses])
      })
      res.json(searchResponse)
    })
  }
  else {
    User.find({})
    .then( async users => {
      const suggestedCourses = await Suggested.find({});
      res.json({users, suggestedCourses});
    })
    .catch(err => res.status(400).json('Error: ' + err));
  }
});

router.route('/').post((req, res) => {
  let email = req.body.details.email;
  User.find({'details.email': email}, (err, result) => {
    if(err) res.json({error: err})
    else if(result && result.length > 0) {
      res.json({error: 'This user already exists. Try to Log in, instead'});
    } else {
      const isInstructor = req.body.isInstructor;
      const isStudent = req.body.isStudent;
      const details = Object(req.body.details);
      const favorites = req.body.favorites;
      const courses = req.body.courses;

      const newUser = new User({
        isInstructor,
        isStudent,
        details,
        favorites,
        courses,
      });

      newUser.save()
      .then(() => res.json(newUser))
      .catch(err => res.status(400).json('Error: ' + err));
    }
  })
});

router.route('/:id').get((req, res) => {
  User.findById(req.params.id)
  .then(user => res.json(user))
  .catch(error => res.status(400).json('Error: ' + error));
});

router.route('/:id').put((req, res) => {
  let reqData = req.body.reqData;
  let userName = req.body.userName;
  if(reqData && reqData === "add") {
    User.findOne({'details.name': userName})
    .then(user => {
      user.courses.id(req.params.id).favorites += 1;
      user.save()
      .then((saveResponse) => {
        res.json('updated successfully');
      })
      .catch(err => res.status(400).json({error: err}));
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
  } else if(reqData && reqData === "remove") {
    User.findOne({'details.name': userName})
    .then(user => {
      user.courses.id(req.params.id).favorites -= 1;
      user.save()
      .then((saveResponse) => {
        res.json('updated successfully');
      })
      .catch(err => res.status(400).json({error: err}));
    })
    .catch(err => {
      res.status(500).json({error: err});
    });
  } else if (reqData && (typeof reqData === "number")) {
    User.findOne({'details.name': userName})
    .then(user => {
      let course = user.courses.id(req.params.id);
      course.rates_number += 1;
      course.rating = Math.ceil((course.rating * (course.rates_number > 1 ? 
        course.rates_number - 1 : 1) + reqData) / course.rates_number)
      user.save()
      .then((saveResponse) => {
        res.json('rating added successfully');
      })
      .catch(err => res.status(400).json({error: err}));
    })
  } else {
    User.findById(req.params.id)
    .then(exercise => {
      exercise.isInstructor = req.body.isInstructor;
      exercise.isStudent = req.body.isStudent;
      exercise.details = Object(req.body.details);
      exercise.favorites = req.body.favorites;
      exercise.courses = req.body.courses;

      exercise.save()
      .then(() => res.json(exercise))
      .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json('Error: ' + err));
  }
});

router.route('/:id').delete((req, res) => {
  User.findById(req.params.id)
  .then((user) => {
    let courses = user.courses;
    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      if(course._id.toString() === req.body.courseId) {
        user.courses.splice(i, 1);
        user.save()
        .then(newUser => {
          res.json(newUser);
        })
        .catch(err => res.status(501).json({error: err}));
        break;
      }
    }
  })
  .catch(err => res.status(400).json({error: err}));
});

module.exports = router;