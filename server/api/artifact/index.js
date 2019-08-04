const bodyParser = require('body-parser');
const express = require('express');
const { ensureAuthenticated } = require('../../helpers');
const { list, byID, update, add } = require('./commands');

const router = express.Router();

router.use(bodyParser.json());

// todo ids of artifacts for user:
//  1. list of artifacts I own
//  2. list of artifacts shared with me
router.get('/artifacts', ensureAuthenticated, list);

// get artifact by id
router.get('/artifact/:id', ensureAuthenticated, byID);

router.post('/artifact/update', ensureAuthenticated, update);

router.post('/artifact/add', ensureAuthenticated, add);

module.exports = router;
