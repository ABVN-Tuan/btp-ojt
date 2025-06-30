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
    function whoami() returns String;
    action calEmpSalary(Employee: empId) returns Boolean;
}
// Grand authorization for entity Employees by role
annotate myService.Employees with @(restrict:[
    {grant: ['READ'],
    to: ['employee','']},
    {grant: ['READ','UPDATE','CREATE','DELETE'],
    to: ['admin']},
]) ;

//Grand authorization for entity Roles by role
annotate myService.Roles with @(restrict:[
    {grant: ['READ'],
    to: ['employee','']},
    {grant: ['READ','UPDATE','CREATE','DELETE'],
    to: ['admin']}
]) ;

// Grand authorization for entity Departments by role
annotate myService.Departments with @(restrict:[
    {grant: ['READ'],
    to: ['employee','']},
    {grant: ['READ','UPDATE','CREATE','DELETE'],
    to: ['admin']}
]) ;

// Grand authorization for entity leaveRequest by role
annotate myService.leaveRequest with @(restrict:[
    {grant: ['READ','UPDATE','CREATE','DELETE'],
    to: ['admin']}
]) ;
annotate myService.whoami with @(restrict:[
    {grant: ['READ','UPDATE','CREATE','DELETE'],
    to: ['admin','employee','']}
]) ;


