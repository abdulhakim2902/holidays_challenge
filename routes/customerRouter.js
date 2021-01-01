const router = require('express').Router();
const Controller = require('../controllers/CustomerController')

router.get('/', Controller.viewCustomers)

router.get('/register', Controller.registerForm);
router.post('/register', Controller.register);

router.get('/:idCustomer/editProfile', Controller.editForm);
router.post('/:idCustomer/editProfile', Controller.edit);

router.get('/:idCustomer/accounts', Controller.viewAccount);
router.post('/:idCustomer/accounts', Controller.addAccount);

router.get('/:idCustomer/accounts/:idAccount/transfer', Controller.transferForm);
router.post('/:idCustomer/accounts/:idAccount/transfer', Controller.transfer)

module.exports = router;