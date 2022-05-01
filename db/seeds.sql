INSERT INTO departments (department_name)
VALUES
    ('sales'),
    ('engineering'),
    ('legal');

INSERT INTO roles (role_title, salary, department_id)
VALUES
    ('Sales Person', 100000, 1),
    ('Software Engineer', 150000, 2),
    ('Lead Software Engineer', 150000, 2),
    ('Lawer', 200000, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
    ('Dylan', 'Hazel', 3, null),
    ('Jim', 'White', 1, null),
    ('Sara', 'Violet', 4, null),
    ('Matthew', 'Jerich', 2, 1);