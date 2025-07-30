import { DataTypes } from "sequelize"

const defineBooking = (sequelize) => {
  const Booking = sequelize.define(
    "Booking",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: {
            args: [["pending", "completed", "cancelled"]],
            msg: "Status must be one of: pending, completed, cancelled",
          },
        },
      },
      bookingDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      tripId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Trips',
          key: 'id'
        }
      },
    },
    {
      timestamps: true,
    }
  )

  return Booking
}

export default defineBooking
