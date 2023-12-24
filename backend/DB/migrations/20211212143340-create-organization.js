module.exports = {
  async up(queryInterface, DataTypes, done) {
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.createTable('organizations', [
        {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV1,
            primaryKey: true,
            //autoIncrement: true
          },
          name: DataTypes.STRING,
          logo: DataTypes.TEXT,
          description: DataTypes.TEXT,
          address1: DataTypes.TEXT,
          address2: DataTypes.TEXT,
          city: DataTypes.STRING,
          state: DataTypes.STRING,
          zip_code: DataTypes.STRING,
          primary_color: DataTypes.STRING,
          secondary_color: DataTypes.STRING,
          accent_color: DataTypes.STRING,
          status: {
            type: DataTypes.ENUM,
            values: ['0', '1'],
          },
          createdAt: DataTypes.DATE,
          updatedAt: DataTypes.DATE,
          attrsToSkip: {
            type: DataTypes.VIRTUAL,
            get() {
              return ['id', 'createdAt', 'updatedAt', 'deletedAt', 'attrsToSkip']
            },
          },
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
    const transaction = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('organizations', { transaction })
      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },
}
