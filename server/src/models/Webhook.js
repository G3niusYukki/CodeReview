const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Webhook = sequelize.define('Webhook', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true
    }
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: false
  },
  events: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: ['review.completed', 'review.failed']
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastTriggeredAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  failureCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

module.exports = Webhook;
