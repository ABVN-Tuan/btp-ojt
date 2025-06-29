// const { sentinelInterval } = require("@sap/cds/lib/srv/srv-models");

sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
], 
function (JSONModel, Device) {
    "use strict";

    return {
        /**
         * Provides runtime information for the device the UI5 app is running on as a JSONModel.
         * @returns {sap.ui.model.json.JSONModel} The device model.
         */
        createDeviceModel: function () {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },
        _setModel: function (oView, oData, sModelName) {
            oView.setModel(new JSONModel(oData), sModelName);
          },
        _getModel: function (oView, sModelName) {
            let oModel = oView.getModel(sModelName);
            return oModel;
          },
        setInitialModel: function(oView){   
        },
        setVisibleControl: function(oView){
            const visibleView = {
                list: true,
                detail: false,
                create: false
            };
            this._setModel(oView, visibleView , "VisibleControl" );
        },
        getListRole: async function(oView){
            try {
                const oResRole = await fetch("/ojt/Roles",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json" }
                });
                if ( oResRole.status == 200 ) {
                    let oresRoleJson = await oResRole.json();
                    let roleList = oresRoleJson.value;
                    this._setModel(oView, roleList, "roleList");
                    console.log(oView.getModel("roleList"));
                    return roleList;
                }
            } 
            catch (error) {
                return null;  
            }    
        },
        getRole: async function(oView){
            try {
                const oResRole = await fetch("/ojt/whoami",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json" }
                });
                console.log(oResRole.status);  
                if ( oResRole.status == 200 ) {
                    console.log('abc');
                    let oresRoJson = await oResRole.json();
                    let role = oresRoJson.value;
                    // this._setModel(oView, role, "role");
                    this._setModel(oView, { role: role }, "role");
                    console.log(role);
                    return role;
                }
            } 
            catch (error) {
                return null;  
            }  
        },
        getListDepart: async function(oView){
            try {
                const oResDe = await fetch("/ojt/Departments",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json" }
                });
                if ( oResDe.status == 200 ) {
                    let oresDeJson = await oResDe.json();
                    let deList = oresDeJson.value;
                    this._setModel(oView, deList, "departmentsList");
                    console.log(oView.getModel("departmentsList"));
                    return deList;
                }
            } 
            catch (error) {
                return null;  
            }    
        },
        getEmployees: async function (oView) {
            try {
                const oRes = await fetch("/ojt/Employees?$expand=role,department",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json" }
                });
                if ( oRes.status == 200 ) {
                    let oresJson = await oRes.json();
                    let empList = oresJson.value;
                    this._setModel(oView, empList, "EmployeeList");
                    return empList;
                }
            } 
            catch (error) {
                return null;  
            }         
        },
        deleteEmployee: async function(oView, sModelName, sEmployeeId) {
            try {
                const sUrl = `/ojt/Employees(${sEmployeeId})`;
  
                console.log("🛰️ Gọi API DELETE tới URL:", sUrl);
              const oRes = await fetch("/ojt/Employees('${sEmployeeId}')", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
              });
              if (oRes.status === 204) {
                const oModel = this._getModel(oView, sModelName);
                const oData = oModel.getData();
                if (Array.isArray(oData.items)) {
                  const filtered = oData.items.filter(emp => emp.ID !== sEmployeeId);
                  this._setModel(oView, { items: filtered }, sModelName);
                }
                return true;
              } else {
                console.error(`Delete failed with status ${oRes.status}`);
                return false;
              }
            } catch (error) {
              console.error("Error in deleteEmployee:", error);
              return false;
            }
          }
          

    };

});