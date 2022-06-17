'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

      return queryInterface.addColumn(
        'Users',
        'photo_id',
        {
          type: Sequelize.INTEGER,
          references: {model: 'File', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          allowNull: true,
        }
      )
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'photo_id')
  }
};
