'use strict';

const express = require('express');
const Courses = require('../models').Course;
const Users = require('../models').User;
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const router = express.Router();

/* Courses routes */

// Get all Courses route:
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const courses = await Courses.findAll({
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Users,
          as: 'User',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });
    res.status(200).json(courses);
  })
);

// Get route to a certain course:
router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await Courses.findByPk(req.params.id, {
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
      include: [
        {
          model: Users,
          as: 'User',
          attributes: {
            exclude: ['password', 'createdAt', 'updatedAt'],
          },
        },
      ],
    });
    if (course) {
      res.status(200).json(course);
      console.log(course);
    } else {
      res.status(404);
    }
  })
);

// Post route to add a course:
router.post(
  '/courses',
  authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Courses.create(req.body);
      res.status(201).location(`/courses/${course.id}`).end();
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

// Put route to update a course:
router.put(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Courses.findByPk(req.params.id);
      if (course) {
        if (req.currentUser.id === course.userId) {
          await course.update(req.body);
          res.status(204).end();
        } else {
          res
            .status(403)
            .json({ message: 'Only the course owner can update.' });
        }
      } else {
        res.status(403).json({ message: 'Course was not updated' });
      }
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

// Delete route to delete a course:
router.delete(
  '/courses/:id',
  authenticateUser,
  asyncHandler(async (req, res) => {
    let course = await Courses.findByPk(req.params.id);
    if (course.userId === req.currentUser.id) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.status(403).json({ message: 'Only the course owner can delete.' });
    }
  })
);

module.exports = router;
