const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
require('dotenv').config();

// define mysql query strings to use with cTable in the prompt functions
const employeeStr = `
SELECT employees1.id,
employees1.first_name,
employees1.last_name,
CONCAT(employees2.first_name, ' ', employees2.last_name) AS manager_name,
roles.role_title AS job_title,
roles.salary AS salary,
departments.department_name AS department
FROM employees employees1
LEFT JOIN roles ON employees1.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees employees2 ON employees1.manager_id = employees2.id;
`
const departmentStr = 'SELECT * FROM departments;'
const rolesStr = `
SELECT roles.id,
role_title AS job_title,
salary,
departments.department_name AS department
FROM roles
LEFT JOIN departments ON roles.department_id = departments.id;
`

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: process.env.DB_USER,
        // Your MySQL password
        password: process.env.DB_PW,
        database: 'jerich_co'
    },
    console.log('Connected to the employees database.')
);

// inital prompt
const initPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'whatToDo',
            message:'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role'
            ]
        }
    ])
    .then(results => {
        if(results.whatToDo === 'view all departments') {
            db.query(departmentStr, (err, rows) => {
                console.table(rows);
                initPrompt();
            })
        } else if (results.whatToDo === 'view all roles') {
            db.query(rolesStr, (err, rows) => {
                console.table(rows);
                initPrompt();
            })
        } else if (results.whatToDo === 'view all employees') {
            db.query(employeeStr, (err, rows) => {
                console.table(rows);
                initPrompt();
            })
        } else if (results.whatToDo === 'add a department') {
            console.log('add department')
            initPrompt();
        } else if (results.whatToDo === 'add a role') {
            console.log('add role')
            initPrompt();
        } else if (results.whatToDo === 'add an employee') {
            console.log('add employee')
            initPrompt();
        } else if (results.whatToDo === 'update an employee role') {
            console.log('add update an employee role')
            initPrompt();
        }
    })
};

// prompt when user selects 'add new department'
const addDepartmentPrompt = () => {
    // add stuff to make a new department
};

// prompt when user selects 'add new role'
const addRolePrompt = () => {
    // add stuff to make a new department
};

// prompt when user selects 'add new employee'
const addEmployeePrompt = () => {
    // add stuff to make a new department
};

initPrompt();