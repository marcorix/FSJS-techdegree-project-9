'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please add a first name.',
          },
          notEmpty: {
            msg: 'Please add a first name.',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Please add a last name.',
          },
          notEmpty: {
            msg: 'Please add a last name',
          },
        },
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'The email address should be unique. This email is already being used.',
        },
        validate: {
          notNull: {
            msg: 'Please add an email.',
          },
          notEmpty: {
            msg: 'Please add an email.',
          },
          isEmail: {
            msg: 'The email is not formatted correctly.',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(val) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        },
        validate: {
          notNull: {
            msg: 'A password is required',
          },
          notEmpty: {
            msg: 'please provide a password',
          },
        },
      },
    },
    { sequelize }
  );
  User.associate = (models) => {
    User.hasMany(models.Course, {
      //has many model associations, shares alias and foreign key with associated model
      as: 'User',
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  return User;
};
