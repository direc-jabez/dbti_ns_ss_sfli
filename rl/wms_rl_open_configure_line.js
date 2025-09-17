/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define([],

    function () {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            log.debug('requestParams', requestParams);

            var r_by = requestParams.released_by;

            var c_by = requestParams.checked_by;

            var if_date = requestParams.date;

            if (if_date) {

                var is_date_valid = isValidDateMDY(if_date);

                if (!is_date_valid) {

                    throw 'Date is invalid.';

                }

            }

            var forex_date = requestParams.forex;

            var itemDetails = requestParams.itemDetails;

            var fulfillArray = requestParams.fulfillArray;

            var item = itemDetails.fullfillItem;

            var line = itemDetails.line;

            var item_inventory_details = getItemInventoryDetails(item, line, fulfillArray);

            log.debug('item_inventory_details', item_inventory_details);

            var max_qty = 0;

            if (item_inventory_details.length > 0) {

                max_qty = item_inventory_details[0]?.qty || 0;

            }

            log.debug('max_qty', max_qty);

            return {
                fullfillItem: itemDetails,
                maxQty: max_qty,
                released_by: r_by,
                checked_by: c_by,
                date: if_date,
                forex: forex_date,
            };
        }

        function getItemInventoryDetails(item, line, fulfillArray) {

            var inventory_details = fulfillArray.filter(fulfill => fulfill.line === line && fulfill.item_name === item);

            return inventory_details;

        }

        function isValidDateMDY(dateStr) {
            // Check format M/D/YYYY or MM/DD/YYYY
            const regex = /^(0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/\d{4}$/;
            if (!regex.test(dateStr)) return false;

            const [month, day, year] = dateStr.split('/').map(Number);
            const date = new Date(year, month - 1, day);

            // Check if the constructed date matches input values (avoids overflow like 2/30)
            return (
                date.getFullYear() === year &&
                date.getMonth() === month - 1 &&
                date.getDate() === day
            );
        }

        return {
            'post': doPost
        };

    });