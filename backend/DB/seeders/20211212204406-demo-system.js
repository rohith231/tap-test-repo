const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('systems', [{
        id: 'b97ac308-649b-44b8-81d3-160158c53322',
        name: 'test system',
        description: '',
        abbreviation: 'test',
        identifier: 'test',
        organization_id: '07e3c3e0-f20f-11ea-b36c-cf90bdc91f63',
        user_id: '61866391-52f0-4b94-b048-c417eae8e3f9',
        status: false,
        ato_approval_step: 'Create',
        // oss_credentials: '[]', do not include to seed default value.
        createdAt: new Date(),
        updatedAt: new Date(),
      }], {});
  },

  down: async (queryInterface, Sequelize) => {
     return await queryInterface.bulkDelete('systems', null, {})
  }
};
