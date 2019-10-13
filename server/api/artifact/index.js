const express = require('express');
const { ensureAuthenticated } = require('../../helpers');
const {
  list,
  byID,
  update,
  add,
  addComment,
  updateComment,
} = require('./commands');

const router = express.Router();

// todo ids of artifacts for user:
//  1. list of artifacts I own
//  2. list of artifacts shared with me
router.get('/artifacts', ensureAuthenticated, list);

// get artifact by id
router.get('/artifact/:id', ensureAuthenticated, byID);

router.post('/artifact/update', ensureAuthenticated, update);

router.post('/artifact/add', ensureAuthenticated, add);

router.post('/artifact/comment/add', ensureAuthenticated, addComment);

router.post('/artifact/comment/update', ensureAuthenticated, updateComment);

module.exports = router;
