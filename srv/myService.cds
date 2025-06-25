using { ojt as data} from '../db/schema';
@path: '/ojt'
service myService @(required: 'authenticated-user'){
    entity Roles as projection on data.Roles;
    entity Departments as projection on data.Departments;
    entity Employees as projection on data.Employees;
    entity leaveRequest as projection on data.leaveRequest;
    type empId {
        empID: UUID;
    };
    action calEmpSalary(Employee: empId) returns Boolean;
}
//Grand authorization by role
annotate myService with @(restrict:[
    {grant: ['READ'],
    to: ['employee','admin']},
    {grant: ['READ','UPDATE','CREATE','DELETE'],
    to: ['admin']}
]) ;


