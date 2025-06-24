using { ojt as data} from '../db/schema';
@path: '/ojt'
service myService @(required: 'authenticated-user'){
    entity Roles as projection on data.Roles;
    entity Departments as projection on data.Departments;
    entity Employees as projection on data.Employees;
    entity leaveRequest as projection on data.leaveRequest;
}
annotate myService with @(restrict:[
    {grant: ['READ'],
    to: ['admin, employes']},
    {grant: ['UPDATE', 'CREATE','DELETE'],
    to: ['admin']}
]) ;
