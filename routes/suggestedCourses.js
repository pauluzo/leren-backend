const router = require('express').Router();
let Suggested = require('../models/suggested.model');

router.route('/').get((req, res) => {
  Suggested.find()
  .then(users => res.json(users))
  .catch(err => res.status(400).json('Error: ' + err));
});

module.export = router;