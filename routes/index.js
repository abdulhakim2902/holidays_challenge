const router = require('express').Router();
const customerRouter = require('./customerRouter');
const Controller = require('../controllers/CustomerController');

router.get('/', Controller.homepage);
router.use('/customers', customerRouter);

module.exports = router;