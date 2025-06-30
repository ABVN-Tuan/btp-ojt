class myService extends cds.ApplicationService{
    init(){
        const { Employees } = this.entities;
        this.before(['CREATE'], Employees,this.calSalary);
        this.on('calEmpSalary',this.reCalSalary);
        this.on('whoami', this.getRoleOnly);
        return super.init();
    }
    //update salary
    async reCalSalary(req) {
        console.log('reddata',req.data.Employee);
        let empData = req.data.Employee;
        let roleId = empData.role_ID;
        let performanceRating = empData.performanceRating;
        // get roles data
        const rolesData = await SELECT.from("Roles").where({ID: roleId })
                                    .columns('baseSalary','allowance');
        const now = new Date();   
        //calculate working years                         
        let salary = rolesData[0].baseSalary;    
        let allowance = rolesData[0].allowance;               
        if (empData.hireDate || salary == null){
          const hireDate = new Date(empData.hireDate);
          let years = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24 * 365));
          if (years <= 0){ years = 0; }
          empData.salary = parseFloat((salary + 1000 * years + allowance + 500 * performanceRating).toFixed(2));
          //Update salary 
          return empData.salary;        
        }
    }
    //Calculate salary when post employee
    async calSalary(employees) {
        const now = new Date();
        if (!Array.isArray(employees)) employees = [employees];
        for (let emp of employees) {
          //Get role data
          const roleData = await SELECT.from("Roles").where({ID:emp.data.role.ID})
                                             .columns('baseSalary','allowance');                             
          let salary = roleData[0].baseSalary; 
          let allowance = roleData[0].allowance;                            
          if (!emp.data.hireDate || salary == null) continue;
          const hireDate = new Date(emp.data.hireDate);
          const years = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24 * 365));
          //Calculate salary
          emp.data.salary = parseFloat((salary + 1000 * years + allowance).toFixed(2));
        }
    };
    async getRoleOnly(req) {
      const roles = req.user.roles || {};
      console.log(roles);
      console.log(roles);
      if (roles.admin === 1) {
        return "admin";
      }
      
    }
  
}
module.exports = myService;
