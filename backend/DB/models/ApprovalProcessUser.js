'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApprovalProcessUser = sequelize.define('ApprovalProcessUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    approval_process_id: {
      type: DataTypes.UUID,
      onDelete: 'cascade',
      references: {
        model: {
          tableName: 'approvals_processes'
        },
        key: 'id'
      },
      allowNull: false
    },
    user_id: {
      type: DataTypes.UUID,
      onDelete: 'cascade',
      references: {
        model: {
          tableName: 'users'
        },
        key: 'id'
      },
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,

  }, {
    indexes: [
      {
          unique: true,
          fields: ['approval_process_id','user_id']
      }
    ],
    timestamps: true,
    // paranoid: true,
    tableName: 'approvals_process_users'
  });

  return ApprovalProcessUser;
};
