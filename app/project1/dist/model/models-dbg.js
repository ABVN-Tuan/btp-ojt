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
                create: false,
                listLeave: false,
                createLeave: false,
            };
            this._setModel(oView, visibleView , "VisibleControl" );
        },
        getRole: async function(oView){
            console.log('start get role');
            try {
                const oResRole = await fetch("/ojt/whoami",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json" }
                });
                console.log(oResRole);
                if ( oResRole.status == 200 ) {
                    let oresRoJson = await oResRole.json();
                    let role = oresRoJson.value;
                    this._setModel(oView, { role: role }, "role");
                    console.log('isAdmin:',role);
                    return role;
                }
                if ( oResRole.status == 204 ) {
                    console.log('vao day khong')
                    this._setModel(oView, { '': '' }, "role");
                    return role;
                }
                
            } 
            catch (error) {
                return null;  
            }  
        },
    };

});