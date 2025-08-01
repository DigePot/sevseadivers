import { DataTypes } from "sequelize";

const defineUser = (sequelize) => {
  const User = sequelize.define("User", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     confirmPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // ✅ Updated role using STRING with validation instead of ENUM
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "client",
      validate: {
        isIn: {
          args: [["staff", "admin", "client"]],
          msg: "Role must be one of: staff, admin, client",
        },
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
    },
    bio:{
    type: DataTypes.STRING,

    },
    address: {
      type: DataTypes.JSONB,
    },
    dateOfBirth: {
      type: DataTypes.DATE,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetPasswordExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return User;
};

export default defineUser;
