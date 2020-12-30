const router = require('express').Router();
const Controller = require('../controllers/CustomerController')

router.get('/customers', Controller.viewCustomers)

router.get('/customers/register', Controller.registerForm);
router.post('/customers/register', Controller.register);

router.get('/customers/:idCustomer/editProfile', Controller.editForm);
router.post('/customers/:idCustomer')

module.exports = router;