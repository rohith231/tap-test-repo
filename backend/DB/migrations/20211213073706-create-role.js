module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('roles', [
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
            //autoIncrement: true
          },
          name: {
            type: DataTypes.STRING,
          },
          createdAt: DataTypes.DATE,
          updatedAt: DataTypes.DATE,
          deletedAt: DataTypes.DATE,
          attrsToSkip: {
            type: DataTypes.VIRTUAL,
            get() {
              return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip'];
            },
          }
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
  down: async (queryInterface, Sequelize) => {
    const transaction = queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('roles', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
