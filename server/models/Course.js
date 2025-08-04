import { DataTypes } from "sequelize";

const defineCourse = (sequelize) => {
  const Course = sequelize.define(
    "Course",
    {
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
      discountedPrice: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Category cannot be empty" },
        },
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Level cannot be empty" },
        },
      },
       staffUserId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Users', // Reference to Users table
      key: 'id',
    },
    allowNull: true, // Allow null for courses without staff assignment
  },
      instructorName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "Instructor name cannot be empty" },
        },
      },
      instructorImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instructorBio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instructorRating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      reviews: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      students: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      posterUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      highlights: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      whatYouWillLearn: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      includes: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      minAge: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      prerequisites: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
        defaultValue: [],
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: "orderIndex",
      },
    },
    {
      tableName: "Courses",
      freezeTableName: true,
      timestamps: true,
      defaultScope: {
        order: [["orderIndex", "ASC"]],
      },
      indexes: [
        {
          fields: ["orderIndex"],
        },
      ],
    }
  );

  return Course;
};

export default defineCourse;
