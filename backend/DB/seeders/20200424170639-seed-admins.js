var bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'users',
      [
        {
          id: '61866391-52f0-4b94-b048-c417eae8e3f9',
          first_name: 'test',
          last_name: 'Admin',
          email: 'test@admin.com',
          display_name: 'super test admin',
          user_name: 'test admin',
          password: bcrypt.hashSync('admin123', 10),
          mobile_number: '796560791',
          pass_change_by_admin: false,
          extension: '926',
          change_pass_in_login: false,
          changedAt: new Date(),
          cannot_change_pass: false,
          account_expires: false,
          expireAt: null,
          disable: false,
          dashboard_widget: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    return await queryInterface.bulkDelete('users', null, {})
  },
}
