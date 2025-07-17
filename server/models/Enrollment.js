import { DataTypes } from 'sequelize';
import defineUser from './User.js';      // Don't import the instance directly, define with sequelize
import defineCourse from './Course.js';

const defineEnrollment = (sequelize) => {
  const User = defineUser(sequelize);
  const Course = defineCourse(sequelize);

  const Enrollment = sequelize.define('Enrollment', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'paid', // or 'pending'
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    courseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
  });

  // Setup associations
  Enrollment.belongsTo(User, { foreignKey: 'userId' });
  Enrollment.belongsTo(Course, { foreignKey: 'courseId' });
  User.hasMany(Enrollment, { foreignKey: 'userId' });
  Course.hasMany(Enrollment, { foreignKey: 'courseId' });

  return Enrollment;
};

export default defineEnrollment;
