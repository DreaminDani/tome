const bodyParser = require("body-parser");
const express = require("express");

const router = express.Router();

router.use(bodyParser.json());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.sendStatus(401);
}

const thoughts = [
  { _id: 123, message: "I love pepperoni pizza!", author: "unknown" },
  { _id: 456, message: "I'm watching Netflix.", author: "unknown" }
];

router.get("/api/thoughts", ensureAuthenticated, (req, res) => {
  console.log(req.isAuthenticated());
  const orderedThoughts = thoughts.sort((t1, t2) => t2._id - t1._id);
  res.send(orderedThoughts);
});

module.exports = router;