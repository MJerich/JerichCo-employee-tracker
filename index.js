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
    },
    console.log('Connected to the employees database.')
);

db.query(`
SELECT employees.id,
employees.first_name,
employees.last_name,
employees.manager_id,
roles.role_title AS job_title,
roles.salary AS salary,
departments.department_name AS department
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id;
`, (err, rows) => {
    console.table(rows);
});
