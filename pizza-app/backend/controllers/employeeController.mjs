import Employee from '../models/employee.mjs';

const createEmployee = async (req, res) => {
    console.log('Received a request to create an employee:', req.body);
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.status(201).send(employee);
    } catch (error) {
        console.error('Error creating employee:', error);
        res.status(500).json({ error: error.message });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.send(employees);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.send(employee);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.send(employee);
    } catch (error) {
        res.status(500).send(error);
    }
};

export default {
    createEmployee,
    getAllEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
