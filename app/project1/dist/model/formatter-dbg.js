sap.ui.define([], () => {
    "use strict";
  
    return {
      formatDate(sDate) {
        if (sDate && sDate != "") {
          let oDate = new Date(sDate + "T00:00:00"); 
          let oOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
          };
  
          return oDate.toLocaleString("en-US", oOptions);
        }
        return "";
      },
      formatCurrency: function (value, currency) {
        if (value == null || isNaN(value)) return "";
        return new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: currency || "USD", 
          minimumFractionDigits: 0,
        }).format(value);
      },
      isAdmin: function (sRole) {
        return sRole === "admin";
      }
    };
  });