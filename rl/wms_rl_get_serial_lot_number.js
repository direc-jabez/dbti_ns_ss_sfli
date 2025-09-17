/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            log.debug('requestParams', requestParams);

            var serial_lot_numbers = [];

            var item_name = requestParams.fullfillItem.fullfillItem;

            var item_id = requestParams.fullfillItem.fullfillItemId;

            log.debug('item_id', item_id);

            var loc_id = requestParams.loc_id;

            var serial_lot_search = createSerialLotSearch(item_id, loc_id);

            serial_lot_search.run().each(function (result) {
                serial_lot_numbers.push({
                    value: result.getValue(result.columns[1]),
                    label: result.getValue(result.columns[0]),
                });
                return true;
            });

            log.debug('serial_lot_numbers', serial_lot_numbers);

            return { serial_lots: serial_lot_numbers };

        }

        function createSerialLotSearch(item_id, loc_id) {

            var inventory_detail_search = search.create({
                type: "inventorynumberbin",
                filters:
                    [
                        ["inventorynumber.item", "anyof", item_id],
                        "AND",
                        ["quantityonhand", "greaterthan", "0"],
                        "AND",
                        ["location", "anyof", loc_id],
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "inventorynumber",
                            summary: "GROUP",
                            label: "Inventory Number"
                        }),
                        search.createColumn({
                            name: "internalid",
                            join: "inventoryNumber",
                            summary: "GROUP",
                            label: "Internal ID"
                        })
                    ]
            });

            return inventory_detail_search;

        }

        function getItemIdByName(item_name) {

            var item_id = '';

            var item_search = search.create({
                type: "item",
                filters:
                    [
                        ["name", "is", item_name]
                    ],
                columns: []
            });


            item_search.run().each(function (result) {
                item_id = result.id;
                return true;
            });

            return item_id;

        }


        return {
            'post': doPost
        };

    });