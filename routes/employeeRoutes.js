const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/employees', employeeController.getEmployees);
router.post('/employees', employeeController.createEmployee);
router.get('/employees/:eid', employeeController.getEmployeeById);
router.put('/employees/:eid', employeeController.updateEmployee);
router.delete('/employees', employeeController.deleteEmployee);
router.delete('/employees/:eid', employeeController.deleteEmployee);

module.exports = router;