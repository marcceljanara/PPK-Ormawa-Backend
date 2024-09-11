module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sensors', {
      sensor_id: {
        type: Sequelize.INTEGER, // Menggunakan INTEGER untuk auto-increment
        autoIncrement: true, // Menandakan kolom ini auto-increment
        allowNull: false,
        primaryKey: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      temperature: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      humidity: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      lux: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      co2: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      soil_moisture: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Sensors');
  },
};
