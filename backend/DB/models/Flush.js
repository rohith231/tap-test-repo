'use strict';
module.exports = (sequelize, DataTypes) => {
  const flush = sequelize.define('Flush', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        //autoIncrement: true
      },
      model: {
        type: DataTypes.STRING,
      },
      key: {
        type: DataTypes.STRING,
      },
      related_id: {
        type: DataTypes.UUID,
      },
      user_id: {
        type: DataTypes.UUID,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
      deletedAt: DataTypes.DATE,
        attrsToSkip: {
          type: DataTypes.VIRTUAL,
          get() {
            return ['id', 'createdAt', 'updatedAt', 'model', 'key', 'user_id', 'related_id','attrsToSkip'];
          },
        }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['model', 'key', 'related_id', 'user_id']
        }
      ],
      timestamps: true,
      paranoid: true,
      tableName: 'flushes'
    })
    return flush;
    };
