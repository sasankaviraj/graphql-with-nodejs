const {ApolloServer,gql} = require('apollo-server');
const EmployeeService = require('./datasources/file');
const ProjectService = require('./datasources/project');
const typeDefs = gql`
type Query {
    employees (
        id:ID,
        firstName:String,
        lastName:String,
        designation:String,
        department:String,
        nearestCity:String,
    ): [Employee],
    findEmployeeById(id:ID):Employee,
    projects:[Project],
    findProjectById(id:ID):Project
}
type Employee{
    id:ID!,
    firstName:String,
    lastName:String,
    designation:String,
    department:String @deprecated(reason:"blah blah blah..."),
    nearestCity:String,
    projects:[Project]
}

type Project{
    id:ID!,
    projectName:String
    startDate:String
    client:String
    employees:[Int]
}
`
//inside employees(firstName:String,lastName:String,...) above it means it can be filter the employees by any value
//ID! means id should not be null

const dataSources = ()=>({
    employeeService: new EmployeeService(),
    projectService: new ProjectService()
});

const resolvers = {
    Query: {
        employees: (parents,args,{dataSources},info)=>{
            return dataSources.employeeService.getEmployees(args); // return array because we says we are exposing an array (in typeDefs)
        },
        findEmployeeById:(parents,{id},{dataSources},info)=>{
            return dataSources.employeeService.getEmployeesById(id)[0];
        },
        projects:(parent,args,{dataSources},info)=>{
            return dataSources.projectService.getProjects();
        },
        findProjectById:(parent,{id},{dataSources},info)=>{
            return dataSources.projectService.findProjectById(id);
        }
    },
    Employee: {
        async projects(employee,args,{dataSources},info){
            let  projects = await dataSources.projectService.getProjects();
            let workingProjects = projects.filter((project)=>{
                return project.employees.includes(employee.id)
            });
            return workingProjects;
        }
    }//this resolver is for employee cause it don't have anything mentioned about project in object
};

const gqlServer = new ApolloServer({typeDefs,resolvers,dataSources}); //telling gql to use the defined resolver and datasources

gqlServer.listen({port:process.env.port||4000}).then(({url})=>console.log('graphql started on '+url));


/*
-----how to query graphql-------

query {
  findEmployeeById(id:25) {
    id
    firstName
    lastName
  }
  employees (department: "Services",designation: "Electrical Engineer"){
      id
      firstName
      lastName
      designation
      department
  }

}


query {
  findProjectById(id:3) {
    projectName
    startDate
  }
  projects {
    projectName
    startDate
    client
  }
  findEmployeeById(id:25) {
    id
    firstName
    lastName
    projects {
      projectName
    }
  }
  employees (department: "Services",designation: "Electrical Engineer"){
      id
      firstName
      lastName
      designation
      department
  }

}
*/