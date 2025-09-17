/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define([],

    function () {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            var line = requestParams.fullfillItem.line;

            var item = requestParams.fullfillItem.fullfillItem;

            var fulfillArray = requestParams.fulfillArray;

            log.debug('item', item);

            log.debug('fulfillArray', fulfillArray);

            var item_inventory_details = getItemInventoryDetails(item, line, fulfillArray);

            log.debug('item_inventory_details', item_inventory_details)

            return { inventoryDetails: item_inventory_details };
        }

        function getItemInventoryDetails(item, line, fulfillArray) {

            var inventory_details = fulfillArray.filter(fulfill => fulfill.line === line && fulfill.item_name === item);

            return inventory_details;

        }

        return {
            'post': doPost
        };

    });