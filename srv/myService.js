class myService extends cds.ApplicationService{
    init(){
        const { Employees } = this.entities;
        this.before(['CREATE'], Employees,this.calSalary);
        this.on('calEmpSalary',this.reCalSalary);
        return super.init();
    }
    async reCalSalary(req) {
        let empId = req.data.Employee.empID;
        // get employee by employee ID
        const empData = await SELECT.from("Employees").where({ID: empId })
                                    .columns('hireDate','role_ID','salary');
        let roleId = empData[0].role_ID;
        // get roles data
        const rolesData = await SELECT.from("Roles").where({ID: roleId })
                                    .columns('baseSalary');
        const now = new Date();                            
        let salary = rolesData[0].baseSalary;                  
        if (empData[0].hireDate || salary == null){
          const hireDate = new Date(empData[0].hireDate);
          const years = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24 * 365));
          console.log(years);
          empData[0].salary = parseFloat((salary + salary * years).toFixed(2)); 
          console.log(empData[0].salary);
          return true;        
        }
    }
    async calSalary(employees) {
        const now = new Date();
        if (!Array.isArray(employees)) employees = [employees];
        for (let emp of employees) {
          const roleData = await SELECT.from("Roles").where({ID:emp.data.role.ID})
                                             .columns('baseSalary');                             
          let salary = roleData[0].baseSalary;                                
          if (!emp.data.hireDate || salary == null) continue;
          const hireDate = new Date(emp.data.hireDate);
          const years = Math.floor((now - hireDate) / (1000 * 60 * 60 * 24 * 365));
          emp.data.salary = parseFloat((salary + salary * years).toFixed(2));
          console.log(emp.data.salary);
          
        }
    }
  
}
module.exports = myService;
