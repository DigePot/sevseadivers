import { DataTypes } from 'sequelize';

const defineUser = (sequelize) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    fullName: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING },
    profilePicture: { type: DataTypes.STRING },
    address: { type: DataTypes.JSONB },
    dateOfBirth: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });
  return User;
};

export default defineUser;
