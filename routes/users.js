'use strict';

const express = require('express');
const Users = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');
const router = express.Router();

/* Users routes */

// Get Route for a list of users:
router.get(
  '/users',
  asyncHandler(async (req, res) => {
    const users = await Users.findAll();
    res.json(users);
    res.status(200).end();
  })
);

// Post Route to add a new user:
router.post(
  '/users',
  asyncHandler(async (req, res) => {
    console.log(req.body);
    try {
      await Users.create(req.body);
      res.location('/');
      res.status(201).end();
    } catch (error) {
      if (
        error.name === 'SequelizeValidationError' ||
        error.name === 'SequelizeUniqueConstraintError'
      ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
        console.log(error);
      } else {
        throw error;
      }
    }
  })
);

module.exports = router;
