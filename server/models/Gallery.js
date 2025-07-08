import { DataTypes } from 'sequelize';

const defineGallery = (sequelize) => {
  const Gallery = sequelize.define('Gallery', {
    title: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    description: { 
      type: DataTypes.TEXT, 
      allowNull: true 
    },
    mediaUrl: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    mediaType: { 
      type: DataTypes.ENUM('image', 'video'), 
      allowNull: false,
      defaultValue: 'image'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    uploadedBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    createdAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
    updatedAt: { 
      type: DataTypes.DATE, 
      defaultValue: DataTypes.NOW 
    },
  });
  return Gallery;
};

export default defineGallery; 