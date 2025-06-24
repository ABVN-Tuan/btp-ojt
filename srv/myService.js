class myService extends cds.ApplicationService{
    intit(){
        const Roles = this.entity;
        console.log(this.entity);
        this.before(['POST','PATCH'],Roles,this.calSalary);
        return super.init();
    }
    calSalary(req) {
    }
}
module.exports = myService;
