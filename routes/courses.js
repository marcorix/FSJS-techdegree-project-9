'use strict';

const express = require('express');
const Courses = require('../models').Course;
const { asyncHandler } = require('../middleware/async-handler');
const router = express.Router();

/* Courses routes */

// Get all Courses route:
router.get(
  '/courses',
  asyncHandler(async (req, res) => {
    const courses = await Courses.findAll({
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt'],
      },
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
  asyncHandler(async (req, res) => {
    let course;
    console.log(req.body);
    try {
      course = await Courses.create(req.body);
      res.status(201).end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        console.log(error);
        res.json({
          message: 'The course could not be created.',
        });
        res.status(400).end();
      } else {
        console.log(error);
        throw error;
      }
    }
  })
);

// Put route to update a course:
router.put(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    let course;
    try {
      course = await Courses.findByPk(req.params.id);
      if (course) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Course was not updated' });
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        console.log(error);
        res.json({
          message: 'The course could not be updated.',
        });
        res.status(400).end();
      } else {
        console.log(error);
        throw error;
      }
    }
  })
);

// Delete route to delete a course:
router.delete(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    let course = await Courses.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
  })
);

module.exports = router;
