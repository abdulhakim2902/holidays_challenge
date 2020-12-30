const { Account, Customer } = require('../models');

class Controller {
    static viewCustomers(req, res) {
        res.send('View Customer')
    }

    static registerForm(req, res) {
        res.send('View Register Form');
    }

    static register(req, res) {
        res.redirect('/customers')
    }

    static editForm(req, res) {
        res.send('View Update Form')
    }

    static edit(req, res) {
        res.redirect('/customers')
    }

    static viewAccount(req, res) {

    }

    static addAccount(req, res) {

    }

    static transferForm(req, res) {

    }

    static transfer(req,res) {

    }
}

module.exports = Controller;