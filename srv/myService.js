class myService extends cds.ApplicationService{
    init(){
        const { Employees } = this.entities;
        this.before(['CREATE'], Employees,this.calSalary);
        this.on('calEmpSalary',this.reCalSalary);
        return super.init();
    }
    //update salary
    async reCalSalary(req) {
        let empId = req.data.Employee.empID;
        // get employee by employee ID
        const empData = await SELECT.from("Employees").where({ID: empId })
                                    .columns('hireDate','role_ID','salary','performanceRating');
        let roleId = empData[0].role_ID;
        let performanceRating = empData[0].performanceRating;
        // get roles data
        const rolesData = await SELECT.from("Roles").where({ID: roleId })
                                    .columns('baseSalary','allowance');
        const now = new Date();   
        //calculate working years                         
        let salary = rolesData[0].baseSalary;    
        let allowance = rolesData[0].allowance;               
        if (empData[0].hireDate || salary == null){
          const hireDate = new Date(empData[0].hireDate);
          const years = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24 * 365));
          empData[0].salary = parseFloat((salary + 1000 * years + allowance + 500 * performanceRating).toFixed(2));
          //Update salary 
          await UPDATE('Employees')
          .set({ salary: empData[0].salary })
          .where({ ID: empId });
          return true;        
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
    }
  
}
module.exports = myService;
