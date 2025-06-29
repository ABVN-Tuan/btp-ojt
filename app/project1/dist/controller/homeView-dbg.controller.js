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
          serviceUrl: "/ojt/", // r
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
        Model.setInitialModel(oView);
        await Model.getListRole(oView);
        await Model.getListDepart(oView);
        Model.setVisibleControl(oView);
        await Model.getEmployees(oView);
      },
      onPressItem: async function (oEvent) {
        const oView = this.getView();
        const oItem = oEvent.getSource(); 
        const oContext = oItem.getBindingContext("EntityList");
        try {
          const oSelEmployee = await oContext.requestObject(); 
          const oJSONModel = new sap.ui.model.json.JSONModel(oSelEmployee);
          this.getView().setModel(oJSONModel, "employDetail");
        } catch (err) {
        }
        oView.getModel("VisibleControl").setProperty("/", {
          list: false,
          detail: true,
          create: false
        });
        Model._setModel(oView, { isEdit: false }, "Edit");
      },
      onPressBack: function () {
        const oView = this.getView();
        oView.getModel("VisibleControl").setProperty("/", {
          list: true,
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
      onPressCreEmp: function () {
        const oEmptyEmp = {
          firstName: "",
          lastName: "",
          email: "",
          hireDate: "",
          dateOfBirth: "",
          salary: 0,
          gender: false,
          role: { ID: "" },               
          department: { ID: "" }          
        };
        const oView = this.getView();
        oView.setModel(new sap.ui.model.json.JSONModel(oEmptyEmp),"createDetail");
        oView.getModel("VisibleControl").setProperty("/", {
          list: false,
          detail: false,
          create: true,
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
    });
  }
);
