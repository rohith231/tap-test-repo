module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('systems', [
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
            //autoIncrement: true
          },
          name: {
            type: DataTypes.STRING,
            // validate: {
            //   len: {
            //     args: [3, 100],
            //     msg: 'System name must be between 3 and 100 characters long.'
            //   },
            // },
            // unique: {
            //   msg: 'System name already taken.'
            // },
          },
          description: {
            type: DataTypes.TEXT,
          },
          abbreviation: {
            type: DataTypes.STRING,
            // validate: {
            //   len: {
            //     args: [3, 30],
            //     msg: 'System abbreviation must be between 3 and 30 characters long.'
            //   },
            // },
            // unique: {
            //   msg: 'System abbreviation already taken.'
            // },
          },
          identifier: {
            type: DataTypes.STRING,
            // validate: {
            //   len: {
            //     args: [3, 100],
            //     msg: 'System identifier must be between 3 and 100 characters long.'
            //   },
            // },
            // unique: {
            //   msg: 'System identifier already taken.'
            // },
          },
          organization_id: {
            type: DataTypes.UUID,
          },
          user_id: {
            type: DataTypes.UUID,
          },
          status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          ato_approval_step: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'Create',
          },
          oss_credentials: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            allowNull: false,
            defaultValue: [],
          },
          createdAt: DataTypes.DATE,
          updatedAt: DataTypes.DATE,
          deletedAt: DataTypes.DATE,
          attrsToSkip: {
            type: DataTypes.VIRTUAL,
            get() {
              return [
                'id',
                'createdAt',
                'updatedAt',
                'deletedAt',
                'user_id',
                'organization_id',
                'attrsToSkip',
                'ato_approval_step',
              ]
            },
          },
        },
        ,
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

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('approvals_processes', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
