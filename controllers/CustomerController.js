const { Account, Customer } = require('../models');
const { Op } = require('sequelize');

class Controller {
    static homepage(req, res) {
        res.render('index')
    }

    static viewCustomers(req, res) {
        Customer.findAll({
            order: [
                ['fullName', 'ASC']
            ]
        })
            .then(customers => res.render('customers', {customers}))
            .catch(err => res.send(err.message))
    }

    static registerForm(req, res) {
        let errors = '';

        if (req.query.msg) {
            errors = JSON.parse(req.query.msg)[0]
        }

        res.render('register-form', { customer: {}, errors })
    }

    static register(req, res) {
        let newCustomer = {
            identityNumber: req.body.identityNumber,
            fullName: req.body.fullName,
            address: req.body.address,
            birthDate: req.body.birthDate,
            gender: req.body.gender
        }

        Customer.create(newCustomer)
            .then(() => res.redirect('/customers'))
            .catch(err => {
                let error = {}

                err.errors.forEach(e => {
                    if (error[e.path] === undefined) {
                        error[e.path] = {}
                    }

                    if (error[e.path][e.validatorKey] === undefined) {
                        error[e.path][e.validatorKey] = e.message
                    }
                })

                res.redirect(`/customers/register?msg=${JSON.stringify([error])}`)
            })
    }

    static editForm(req, res) {
        let id = req.params.idCustomer;
        let errors = '';

        if (req.query.msg) {
            errors = JSON.parse(req.query.msg)[0]
        }

        Customer.findOne({ where: { id } })
            .then(customer => res.render('edit-form', { customer, errors }))
            .catch(err => res.send(err.message))    }

    static edit(req, res) {
        let id = req.params.idCustomer;
        let updateCustomer = {
            identityNumber: req.body.identityNumber,
            fullName: req.body.fullName,
            address: req.body.address,
            birthDate: req.body.birthDate,
            gender: req.body.gender
        }

        Customer.findOne({
            where: {
                id,
                identityNumber: updateCustomer.identityNumber
            }
        })
            .then(customer => {
                if (!customer) {
                    return Customer.update(updateCustomer, { where: { id } })
                } else {
                    delete updateCustomer.identityNumber
                    return Customer.update(updateCustomer, { where: { id } })
                }
            })
            .then(() => res.redirect('/customers'))
            .catch(err => {
                let error = {}

                err.errors.forEach(e => {
                    if (error[e.path] === undefined) {
                        error[e.path] = {}
                    }

                    if (error[e.path][e.validatorKey] === undefined) {
                        error[e.path][e.validatorKey] = e.message
                    }
                })

                let errorsStringify = JSON.stringify([error])
                console.log(error);

                res.redirect(`/customers/${id}/editProfile?msg=${errorsStringify}`)
            })
    }

    static viewAccount(req, res) {
        let id = req.params.idCustomer;
        let error = '';

        if (req.query.msg) {
            error = req.query.msg
        }
        
        Customer.findOne({
            where: { id },
            include: Account
        })
            .then(customer => res.render('accounts', { customer, error }))
            .catch(err => res.send(err.message))
    }

    static addAccount(req, res) {
        let newAccount = {
            type: req.body.type || "On Account",
            balance: req.body.balance || 500000,
            customer_id: req.params.idCustomer
        }

        Account.checkAccountNumber(newAccount)
            .then(() => res.redirect(`/customers/${newAccount.customer_id}/accounts`))
            .catch(err => res.redirect(`/customers/${newAccount.customer_id}/accounts?msg=${err.message}`))
    }

    static transferForm(req, res) {
        let customer_id = req.params.idCustomer;
        let account_id = req.params.idAccount;
        let myAccount = '';
        let error = '';

        if (req.query.msg) {
            error = req.query.msg;
        }

        Account.findOne({ where: {id: account_id}})
            .then(account => {
                myAccount = account;
                return Account.findAll({
                    order: [
                        ['accountNumber', 'ASC']
                    ],
                    where: {
                        id: { 
                            [Op.ne]: [account_id]
                        }
                    },
                    include: Customer
                })
            })
            .then(accounts => res.render('transfer-form', { accounts, myAccount, customer_id, account_id, error }))
            .catch(err => res.send(err.message))
    }

    static transfer(req,res) {
        let customer_id = req.params.idCustomer;
        let account_id = req.params.idAccount;

        let money = {
            amount: +req.body.amount,
            accountNumber: req.body.accountNumber
        }

        Account.findOne({where: {id: account_id}})
            .then(account => {
                let remaining = account.balance - money.amount;
                return Account.update({balance: remaining}, {
                    where: {id: account.id},
                    individualHooks: true
                })
            })
            .then(() => {
                return Account.findOne({where: {accountNumber: money.accountNumber}})
            })
            .then(account => {
                let current = account.balance + money.amount;
                return Account.update({balance: current}, {where: {id: account.id}})
            })
            .then(() => res.redirect(`/customers/${customer_id}/accounts`))
            .catch(err => res.redirect(`/customers/${customer_id}/accounts/${account_id}/transfer?msg=${err.message}`))
    }
}

module.exports = Controller;