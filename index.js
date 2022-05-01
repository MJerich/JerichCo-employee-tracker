const inquirer = require('inquirer');
const cTable = require('console.table');
const mysql = require('mysql2');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your MySQL username,
        user: process.env.DB_USER,
        // Your MySQL password
        password: process.env.DB_PW,
        database: 'jerich_co'
    }
);

// define mysql query strings to use with the prompt functions
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
const addDepartmentStr = `
INSERT INTO departments (department_name)
VALUES
    ('sales')
`

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
                'update an employee role',
                'exit'
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
            addDepartmentPrompt();
        } else if (results.whatToDo === 'add a role') {
            addRolePrompt();
        } else if (results.whatToDo === 'add an employee') {
            addEmployeePrompt();
        } else if (results.whatToDo === 'update an employee role') {
            console.log('add update an employee role')
            initPrompt();
        } else if (results.whatToDo === 'exit') {
            db.end();
        }
    })
};

// prompt when user selects 'add new department'
const addDepartmentPrompt = () => {
    return inquirer.prompt([
        {
            type: 'text',
            name: 'departmentName',
            message: "What is the name of the Department you want to add?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the new departments name!");
                    return false;
                }
            }
        }
    ])
    .then(departmentReults => {
        const addDepartmentStr = `
        INSERT INTO departments (department_name)
        VALUES
            ('${departmentReults.departmentName}')
        `
        // use a sql query to add the new department
        db.query(addDepartmentStr, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
        })
        // ask the inital prompt again
        initPrompt();
    })
};

// prompt when user selects 'add new role'
const addRolePrompt = () => {
    return inquirer.prompt([
        {
            type: 'text',
            name: 'roleName',
            message: "What is the name of the Role you want to add?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the new roles name!");
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'salary',
            message: "What is the salary of this role?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the salary of this role!");
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'departmentID',
            message: "What is department id this role belongs too?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the department id of this role!");
                    return false;
                }
            }
        }
    ])
    .then(roleReults => {
        const addRoleStr = `
        INSERT INTO roles (role_title, salary, department_id)
        VALUES
            ('${roleReults.roleName}', ${roleReults.salary}, ${roleReults.departmentID})
        `
        // use a sql query to add the new department
        db.query(addRoleStr, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
        })
        // ask the inital prompt again
        initPrompt();
    })
};

// prompt when user selects 'add new employee'
const addEmployeePrompt = () => {
    return inquirer.prompt([
        {
            type: 'text',
            name: 'firstName',
            message: "What is the first name if the new employee?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the new employees first name!");
                    return false;
                }
            }
        },
        {
            type: 'text',
            name: 'lastName',
            message: "What is the last name if the new employee?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the new employees last name!");
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'roleID',
            message: "What is role id of the new employees role?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter the role id of the new employees role!");
                    return false;
                }
            }
        },
        {
            type: 'number',
            name: 'managerID',
            message: "What is managers id of the new employee?(leave blank if none)"
        }
    ])
    .then(employeeReults => {
        if(!employeeReults.managerID) {
            employeeReults.managerID = null;
        }
        const addEmployeeStr = `
        INSERT INTO employees (first_name, last_name, role_id, manager_id)
        VALUES
            ('${employeeReults.firstName}', '${employeeReults.lastName}', ${employeeReults.roleID}, ${employeeReults.managerID})
        `
        // use a sql query to add the new department
        db.query(addEmployeeStr, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
        })
        initPrompt();
    })
};

initPrompt();