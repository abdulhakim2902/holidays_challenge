'use strict';
const {
  Model, ValidationError
} = require('sequelize');
const randomAccount = require('../helpers/randomAccount');

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.Customer, {foreignKey: 'customer_id'})
    }

    static checkAccountNumber(newAccount) {
      let randomAccountNumber = randomAccount();

      return Account.findOne({ where: { accountNumber: randomAccountNumber }})
          .then(account => {
            if (!account) {
              newAccount.accountNumber = randomAccountNumber;
              return Account.create(newAccount)
            } else Account.checkAccountNumber(newAccount)
          })   
    }
  }; 
  Account.init({  
    type: DataTypes.STRING,
    balance: {
      type: DataTypes.FLOAT
    },
    accountNumber: DataTypes.STRING,
    customer_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Account',
    hooks: {
      beforeCreate(accountInstance, option) {
        if (+accountInstance.balance < 500000) throw new Error('Minimum balance for new Accout: Rp500.000')
      },
      beforeUpdate(accountInstance, option) {
        if (accountInstance.balance < 0) throw new Error('Insufficient balance')
      }
    }
  });
  return Account;
};