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

            log.debug('item_inventory_details', item_inventory_details);

            var max_qty = 0;

            if (item_inventory_details.length > 0) {

                max_qty = item_inventory_details[0]?.qty || 0;

                log.debug('max_qty', max_qty);

            }

            return { maxQty: max_qty };
            
        }

        function getItemInventoryDetails(item, line, fulfillArray) {

            var inventory_details = fulfillArray.filter(fulfill => fulfill.line === line && fulfill.item_name === item);

            return inventory_details;

        }

        return {
            'post': doPost
        };

    });