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
    instructorImage: {
        type: DataTypes.STRING, // URL to the instructor's image
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
        type: DataTypes.JSON, // Array of strings
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
    
  }, {
    timestamps: true,
  });

  return Course;
};

export default defineCourse;
