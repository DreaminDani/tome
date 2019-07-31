const bodyParser = require('body-parser');
const express = require('express');
const { ensureAuthenticated } = require('../helpers');
const { list, byID, update, add } = require('./commands');

const router = express.Router();

router.use(bodyParser.json());

// todo ids of artifacts for user:
//  1. list of artifacts I own
//  2. list of artifacts shared with me
router.get('/api/artifacts', ensureAuthenticated, list);

// get artifact by id
router.get('/api/artifact/:id', ensureAuthenticated, byID);

router.post('/api/artifact/update', ensureAuthenticated, update);

router.post('/api/artifact/add', ensureAuthenticated, add);

module.exports = router;
