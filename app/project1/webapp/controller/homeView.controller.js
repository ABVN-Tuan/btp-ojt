// const { model } = require("@sap/cds");

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "./../model/models",
    "./../model/formatter",
], (Controller, Model,formatter) => {
    "use strict";

    return Controller.extend("project1.controller.homeView", {
        formatter: formatter,
        onInit: async function () {
            const oView = this.getView();
            Model.setInitialModel(oView);
            await Model.getListRole(oView);
            await Model.getListDepart(oView);
            Model.setVisibleControl(oView);
            await Model.getEmployees(oView);            
        }
        
    });
});