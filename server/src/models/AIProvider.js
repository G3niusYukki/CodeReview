const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AIProvider = sequelize.define('AIProvider', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  providerType: {
    type: DataTypes.ENUM('openai', 'anthropic', 'google', 'openai-compatible', 'custom'),
    allowNull: false
  },
  apiEndpoint: {
    type: DataTypes.STRING,
    allowNull: false
  },
  apiKey: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  defaultModel: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'gpt-4'
  },
  availableModels: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  headers: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  config: {
    type: DataTypes.JSON,
    defaultValue: {
      temperature: 0.3,
      maxTokens: 4000,
      timeout: 60000
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rateLimitRPM: {
    type: DataTypes.INTEGER,
    defaultValue: 60
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'AIProviders'
});

module.exports = AIProvider;
