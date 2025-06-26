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
                detail: false
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

    };

});