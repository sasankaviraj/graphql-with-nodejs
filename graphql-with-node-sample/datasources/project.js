const {RESTDataSource} = require('apollo-datasource-rest');

class ProjectService extends RESTDataSource{

    constructor(){
        super();
        this.baseURL = 'http://localhost:3000';
    }


    getProjects(){
        return this.get('/projects').then((projects)=>{
            return projects;
        }).catch((err)=>console.log(err));
    }

    async findProjectById(id){
        return await this.get('/projects/'+id);
    }
}

module.exports = ProjectService;