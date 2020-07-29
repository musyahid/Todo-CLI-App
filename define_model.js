const Sequelize = require('sequelize');

const path = 'mysql://root@localhost:3306/todo_list';
const sequelize = new Sequelize(path, {
    operatorsAliases: false
});

let Dummy = sequelize.define('todo_list', {
    Name: Sequelize.STRING
});

Dummy.sync().then(() => {
    console.log('New table created');
}).finally(() => {
    sequelize.close();
})