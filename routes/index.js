const router = require('express').Router();
const Controller = require('../controllers/CustomerController')

router.get('/', Controller.homepage)

router.get('/customers', Controller.viewCustomers)

router.get('/customers/register', Controller.registerForm);
router.post('/customers/register', Controller.register);

router.get('/customers/:idCustomer/editProfile', Controller.editForm);
router.post('/customers/:idCustomer/editProfile', Controller.edit);

router.get('/customers/:idCustomer/accounts', Controller.viewAccount);
router.post('/customers/:idCustomer/accounts', Controller.addAccount);

router.get('/customers/:idCustomer/accounts/:idAccount/transfer', Controller.transferForm);
router.post('/customers/:idCustomer/accounts/:idAccount/transfer', Controller.transfer)

module.exports = router;