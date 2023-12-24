const { ENVIROMENT } = require('../../common/config/env')

module.exports = {
  async up(queryInterface, DataTypes, done) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('users', [
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
          },
          first_name: {
            type: DataTypes.STRING,
          },
          last_name: {
            type: DataTypes.STRING,
          },
          display_name: {
            type: DataTypes.STRING,
          },
          email: {
            type: DataTypes.STRING,
          },
          user_name: {
            type: DataTypes.STRING,
          },
          password: {
            type: DataTypes.TEXT,
          },
          mobile_number: {
            type: DataTypes.STRING,
          },
          pass_change_by_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          phone_number: DataTypes.STRING,
          extension: DataTypes.STRING,
          change_pass_in_login: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          changedAt: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          cannot_change_pass: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          account_expires: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          expireAt: {
            type: DataTypes.DATE,
            allowNull: true,
          },
          disable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          dashboard_widget: DataTypes.JSONB,
          createdAt: DataTypes.DATE,
          updatedAt: DataTypes.DATE,
          deletedAt: DataTypes.DATE,
        },
        {
          transaction,
          logging: console.log,
        },
      ])
      return await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('users', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
