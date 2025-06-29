
sap.ui.define(
  ["sap/ui/core/mvc/Controller", "./../model/models", "./../model/formatter",  "sap/m/MessageBox",
    "sap/m/MessageToast",],
  (Controller, Model, formatter,MessageBox, MessageToast) => {
    "use strict";

    return Controller.extend("project1.controller.homeView", {
      formatter: formatter,
      onInit: async function () {
        const oView = this.getView();
        const oODataModel = new sap.ui.model.odata.v4.ODataModel({
          serviceUrl: "/ojt/", 
          synchronizationMode: "None"
        });
        this.byId("itemTable").bindItems({
          path: "EntityList>/Employees",
          parameters: {
            $expand: "role,department"
          },
          template: new sap.m.ColumnListItem({
            type: "Active",
            press: this.onPressItem.bind(this), 
            cells: [
              new sap.m.Text({ text: "{EntityList>firstName},{EntityList>lastName}" }),
              new sap.m.Text({ text: "{EntityList>role/name}" }),
              new sap.m.Text({ text: "{EntityList>department/name}" }),
              new sap.m.Text({ text: "{EntityList>email}" }),
              new sap.m.Button({
                id: "deleteButton",
                icon: "sap-icon://delete",
                type: "Transparent",
                press: this.onDeleteEmployee.bind(this),
                tooltip: "{i18n>deleteTooltip}",
                enabled: {
                  parts: ["role>/role"],
                  formatter: this.formatter.isAdmin
                }
              })             
            ]
          })
        });
        oView.setModel(oODataModel, "EntityList");
        await Model.getRole(oView);
        Model.setVisibleControl(oView);
      },
      onPressItem: async function (oEvent) {
        const oView = this.getView();
        const oItem = oEvent.getSource(); 
        const oContext = oItem.getBindingContext("EntityList");
        try {
          const oSelEmployee = await oContext.requestObject(); 
          const oJSONModel = new sap.ui.model.json.JSONModel(oSelEmployee);
          console.log(oJSONModel);
          this.getView().setModel(oJSONModel, "employDetail");
        } catch (err) {
        }
        oView.getModel("VisibleControl").setProperty("/", {
          list: false,
          detail: true,
          create: false,
          listLeave: false,
          createLeave:false,
        });
        Model._setModel(oView, { isEdit: false }, "Edit");
      },
      onPressBack: function () {
        //Button back event
        const oView = this.getView();
        oView.getModel("VisibleControl").setProperty("/", {
          list: true,
          detail: false,
          create: false,
          listLeave: false,
          createLeave:false,
        });
      },
      onPressLeave: function(){
        const oView = this.getView();
        const oODataModel = new sap.ui.model.odata.v4.ODataModel({
          serviceUrl: "/ojt/", 
          synchronizationMode: "None"
        });
        oView.getModel("VisibleControl").setProperty("/", {
          listLeave: true,
          createLeave:false,
          list: false,
          detail: false,
          create: false,
        });
      },
      onPressEdit: function () {
        const oView = this.getView();
        const oEditModel = oView.getModel("Edit");
        const bIsEdit = oEditModel.getProperty("/isEdit");
        oEditModel.setProperty("/isEdit", !bIsEdit);
      },
      onPressCreList: function() {
        var oStatusData = {
          statuses: [
              { key: "PENDING", text: "Pending" },
              { key: "APPROVED", text: "Approved" },
              { key: "REJECTED", text: "Rejected" }
          ]
      };
      var oStatusModel = new sap.ui.model.json.JSONModel(oStatusData);
      this.getView().setModel(oStatusModel, "statusModel");
        const oEmptyLeave = {
          status: "Pending",
          reason: "",
          endDate: "",
          startDate: "",
          employee: { ID: "" },                  
        };
        const oView = this.getView();
        oView.setModel(new sap.ui.model.json.JSONModel(oEmptyLeave),"createLeaveDetail");
        oView.getModel("VisibleControl").setProperty("/", {
          list: false,
          detail: false,
          create: false,
          listLeave: false,
          createLeave:true
        });
      },
      onPressCreEmp: function () {
        const oEmptyEmp = {
          firstName: "",
          lastName: "",
          email: "",
          hireDate: "",
          dateOfBirth: "",
          salary: 0,
          gender: "",
          role: { ID: "" },               
          department: { ID: "" }          
        };
        const oView = this.getView();
        oView.setModel(new sap.ui.model.json.JSONModel(oEmptyEmp),"createDetail");
        oView.getModel("VisibleControl").setProperty("/", {
          list: false,
          detail: false,
          create: true,
          listLeave: false,
          createLeave:false,
        });
      },
      onDeleteEmployee: function (oEvent) {
        const oItem = oEvent.getSource().getParent(); 
        const oContext = oItem.getBindingContext("EntityList");
      
        if (!oContext) {
          sap.m.MessageToast.show("No data found");
          return;
        }
      
        sap.m.MessageBox.confirm("Are you sure to delete?", {
          onClose: async (sAction) => {
            if (sAction === sap.m.MessageBox.Action.OK) {
              try {
                if (typeof oContext.delete === "function") {
                  await oContext.delete();
                  sap.m.MessageToast.show("Delete success");
                } else {
                  sap.m.MessageBox.error("Delete fail");
                }
              } catch (err) {
                sap.m.MessageBox.error("Delete fail" + err.message);
              }
            }
          }
        });
      },
      onCreateEmployee : async function() {
        //Create employee
        const oView = this.getView();
        const oModel = oView.getModel("EntityList");
        const oCreateData = oView.getModel("createDetail").getData();
        console.log(oModel);
        try {
          //Send post request
          const oListBinding = oModel.bindList("/Employees");
          //Create new record
          await oListBinding.create(oCreateData);
          sap.m.MessageToast.show("Create success");
          //Refresh model
          await oModel.refresh();
          oView.getModel("VisibleControl").setProperty("/", {
            list: true,
            detail: false,
            create: false,
            listLeave: false,
            createLeave:false,
          });
      
        } catch (oError) {
          console.log(oError);
          sap.m.MessageBox.error("Create employee fail",oError);
        }
      },
      onCreateLeave: async function() {
                //Create employee
                const oView = this.getView();
                const oModel = oView.getModel("EntityList");
                const oCreateData = oView.getModel("createLeaveDetail").getData();
                console.log(oModel);
                try {
                  //Send post request
                  const oListBinding = oModel.bindList("/leaveRequest");
                  //Create new record
                  await oListBinding.create(oCreateData);
                  sap.m.MessageToast.show("Create success");
                  //Refresh model
                  await oModel.refresh();
                  oView.getModel("VisibleControl").setProperty("/", {
                    list: false,
                    detail: false,
                    create: false,
                    listLeave: true,
                    createLeave:false,
                  });
              
                } catch (oError) {
                  console.log(oError);
                  sap.m.MessageBox.error("Create leave request fail",oError);
                }
      },
      onPressUpdate: async function () {
        const oView = this.getView();
        const oModel = oView.getModel("EntityList");
        const oUpdateData = oView.getModel("employDetail").getData();
       try {
        const sPath = `/Employees(${oUpdateData.ID})`;
        const oEmpContext = oModel.bindContext(sPath);
        //Check context
        if (!oEmpContext) {
          sap.m.MessageBox.error("Not found data");
          return;
        }
        // Update data
        const oBindingContext = await oEmpContext.getBoundContext();
        oBindingContext.setProperty("firstName", oUpdateData.firstName);
        oBindingContext.setProperty("lastName", oUpdateData.lastName);
        oBindingContext.setProperty("email", oUpdateData.email);
        oBindingContext.setProperty("hireDate", oUpdateData.hireDate);
        oBindingContext.setProperty("performanceRating", parseInt(oUpdateData.performanceRating));
        oBindingContext.setProperty("role_ID", oUpdateData.role.ID);
        oBindingContext.setProperty("department_ID", oUpdateData.department.ID );
        sap.m.MessageToast.show("update employee success");
        //Refresh model
        await oModel.refresh();
       } catch(oError) {
        sap.m.MessageBox.error("Update employee fail",oError);
       }
      },
      onPressSalary: async function () {
        const oView = this.getView();
        const oModel = oView.getModel('EntityList');
        const oDetailModel = oView.getModel('employDetail');
        console.log(oDetailModel);
        const updateID = oView.getModel('employDetail').getData().ID;
        try {
          const oFunction = oModel.bindContext("/calEmpSalary(...)");
          oFunction.getParameterContext().setProperty("Employee/empID", updateID);
          await oFunction.execute();
          const bSuccess = await oFunction.requestObject();
          // console.log(bSuccess);
          if (bSuccess.value === true) {
            await oModel.refresh();
            //Expand to get data from role and department
            const oContextBinding = oModel.bindContext(
              `/Employees('${updateID}')`, 
              null,
              {      
                  $expand: "role,department" 
              }
            );
            await oContextBinding.getBoundContext();
            const oNewEmployeeData = await oContextBinding.requestObject();
            const oJSONModel = new sap.ui.model.json.JSONModel(oNewEmployeeData);
            oView.setModel(oJSONModel, "employDetail");
            sap.m.MessageToast.show("Update salary success");
          } else {
            sap.m.MessageBox.error("Update salary fail");
          }
      
        } catch (err) {
          console.error(err);
          sap.m.MessageBox.error("Call function fail: " + err.message);
        }
      }
    });
  }
);
