(function () {
    var clientFunctions = {};
    clientFunctions.onLoad = function () {
        var dataRecord = mobile.getRecordFromState();
        try {
            var inventoryDetails = dataRecord.scriptParams.inventoryDetails;
            if (!inventoryDetails || inventoryDetails?.length < 1) {
                mobile.hideField('SFLI_IF_Fulfill_Items_Configure_Line_Serial_Lot_Numbers')
            } else {
                mobile.showField('SFLI_IF_Fulfill_Items_Configure_Line_Serial_Lot_Numbers')
            }
        } catch (error) {
            console.log(error);
        }
    };
    return clientFunctions;
})();