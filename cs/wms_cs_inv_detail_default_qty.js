(function () {
    var clientFunctions = {};
    clientFunctions.onLoad = function () {
        var dataRecord = mobile.getRecordFromState();
        console.log(dataRecord.scriptParams);
        var maxQty = dataRecord.scriptParams.maxQty;
        var inv_detail_qty = dataRecord.scriptParams.inv_detail_qty;
        mobile.setValueInPage(
            'SFLI_IF_Fulfill_Items_Configure_Line_Inventory_Detail_Quantity',
            inv_detail_qty || maxQty,
        );
    };
    return clientFunctions;
})();