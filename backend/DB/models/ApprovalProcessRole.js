'use strict';
module.exports = (sequelize, DataTypes) => {
  const ApprovalProcessRole = sequelize.define('ApprovalProcessRole', {
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
    role_id: {
      type: DataTypes.UUID,
      onDelete: 'cascade',
      references: {
        model: {
          tableName: 'roles'
        },
        key: 'id'
      },
      allowNull: false
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,

  }, {
    indexes: [{
      unique: true,
      fields: ['approval_process_id', 'role_id']
    }],
    timestamps: true,
    // paranoid: true,
    tableName: 'approvals_process_roles'
  });

  return ApprovalProcessRole;
};
