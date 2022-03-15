const employees = require('../data/employees.json');
const {DataSource} = require('apollo-datasource');
const _ = require('lodash'); //using for filtering data
class EmployeeService extends DataSource{
    constructor(){
        super();
    }

    initialize(config){

    }

    getEmployees(args){ //args to filter
        return _.filter(employees,args);
    }

    getEmployeesById(id){
        return employees.filter((employee)=>{
            return employee.id == id;
        });;
    }
}

module.exports = EmployeeService //should be export unless no one can use this