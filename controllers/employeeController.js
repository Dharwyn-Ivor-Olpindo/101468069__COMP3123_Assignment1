const Employee = require('../models/Employee');
const { logEvent } = require('../middleware/logger');

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({ user: req.user.userId });
    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const { first_name, last_name, email, position, salary, date_of_joining, department } = req.body;

    const employee = new Employee({
      first_name,
      last_name,
      email,
      position,
      salary,
      date_of_joining,
      department,
      user: req.user.userId
    });

    await employee.save();
    logEvent(`Employee created: ${first_name} ${last_name} by user ${req.user.userId}`, 'INFO');

    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: employee
    });
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  try {
    const employeeId = req.params.eid;
    const employee = await Employee.findOne({ _id: employeeId, user: req.user.userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found or unauthorized access.'
      });
    }

    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employeeId = req.params.eid;
    let employee = await Employee.findOne({ _id: employeeId, user: req.user.userId });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found or unauthorized access.'
      });
    }

    employee = await Employee.findByIdAndUpdate(
      employeeId,
      { ...req.body, updated_at: Date.now() },
      { new: true, runValidators: true }
    );

    logEvent(`Employee updated: ${employeeId}`, 'INFO');
    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employeeId = req.query.eid || req.params.eid;

    if (!employeeId) {
      return res.status(400).json({ success: false, message: 'Employee ID (eid) is required.' });
    }

    const employee = await Employee.findOne({ _id: employeeId, user: req.user.userId });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found or unauthorized access.' });
    }

    await Employee.findByIdAndDelete(employeeId);
    logEvent(`Employee deleted: ${employeeId}`, 'INFO');

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
};