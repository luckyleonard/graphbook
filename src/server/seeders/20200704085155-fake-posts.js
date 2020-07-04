'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkInsert(
      'Posts',
      [
        {
          text: 'Lorem ipsum 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          text: 'Lorem ipsum 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Posts', null, {});
  },
};
