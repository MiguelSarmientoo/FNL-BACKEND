'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('test_estres_salida', {
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, 
      },
      user_id: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',  
          key: 'id',
        },
      },
      pregunta_1: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_2: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_3: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_4: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_5: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_6: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_7: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_8: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_9: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_10: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_11: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_12: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_13: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_14: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_15: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_16: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_17: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_18: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_19: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_20: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_21: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_22: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      pregunta_23: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      estado: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('test_estres_salida');
  }
};
