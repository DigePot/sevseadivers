import { DataTypes } from "sequelize"

const defineRental = (sequelize) => {
  const Rental = sequelize.define(
    "Rental",
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
      location: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: "N/A",
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "1 day",
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "available",
        validate: {
          isIn: {
            args: [["available", "rented", "maintenance"]],
            msg: "Status must be one of: available, rented, maintenance",
          },
        },
      },
    },
    {
      timestamps: true,
    }
  )
  return Rental
}

export default defineRental
