import { DataTypes } from "sequelize"

const defineRentalBooking = (sequelize) => {
  return sequelize.define(
    "RentalBooking",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
        validate: {
          isIn: [["active", "completed", "cancelled"]],
        },
      },
      paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "paid", "failed", "refunded"]],
        },
      },
      paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
    }
  )
}

export default defineRentalBooking
