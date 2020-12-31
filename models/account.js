'use strict';
const {
  Model
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
            } else {
              Account.checkAccountNumber(newAccount)
            }
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
    modelName: 'Account'
  });
  return Account;
};