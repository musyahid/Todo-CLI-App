#!/usr/bin/env node
'use strict'
const prog = require('caporal')
const Sequelize = require('sequelize')
const path = 'mysql://root@localhost:3306/todo_list'
const Confirm = require('prompt-confirm')


const sequelize = new Sequelize(path, {
    operatorsAliases: false,
    logging: false
})

let List = sequelize.define('list', {
    Name: Sequelize.STRING
})

prog.version('1.0.0')
    .command('todo list', 'Show all todo list')
    .action((args, option, logger) => {
        async function findAllRows() {
            let todo_list = await List.findAll({ raw: true });
            todo_list.forEach(list => {
                logger.info(`${list.id}. ${list.Name}`)
            })
            sequelize.close();
        }
        findAllRows();
    })
    .command('todo add', 'Add new todo item')
    .argument('<item>', 'Item to add')
    .action((args, option, logger) => {
        const note = List.build({ Name: args.item });
        note.save().then(() => {
            logger.info('new list saved')
        }).finally(() => {
            sequelize.close();
        });
    })
    .command('todo update', 'Add new todo item')
    .argument('<id>', 'Parameter ID')
    .argument('<value>', 'Value')
    .action((args, option, logger) => {
        async function updateRow() {

            let id = await List.update(
                { Name: args.value },
                { where: { id: args.id } });
            sequelize.close();
        }
        
        updateRow();
    })
    .command('todo del', 'Delete todo item')
    .argument('<id>', 'Parameter ID')
    .action((args, option, logger) => {
        async function deleteRow() {
            let n = await List.destroy({ 
                where: { id: args.id } 
            });
            logger.info(`Deleted row`)
            sequelize.close();
        }
        deleteRow();
    })
    .command('todo clear', 'Delete all item')
    .action((args, option, logger) => {
        async function deleteRow() {
            
            let n = await List.destroy({ 
                where: {},
                truncate: true
            });
            logger.info(`Deleted all item`)
            sequelize.close();
        }
        const prompt = new Confirm('Are you sure want to delete?');
        prompt.ask(function(answer) {
            if (answer == true) {
                deleteRow();
            }
          });
        
    })



prog.parse(process.argv);