import { DataTypes } from 'sequelize';

const defineCourse = (sequelize) => {
  const Course = sequelize.define('Course', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 category: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notEmpty: { msg: 'Category cannot be empty' },
  },
},
level: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notEmpty: { msg: 'Level cannot be empty' },
  },
},
instructorName: {
  type: DataTypes.STRING,
  allowNull: false,
  validate: {
    notEmpty: { msg: 'Instructor name cannot be empty' },
  },
},

  }, {
    timestamps: true,
  });

  return Course;
};

export default defineCourse;
