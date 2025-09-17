/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        function doPost(requestBody) {

            log.debug('requestBody', requestBody);

            var serial_lot_numbers = [];

            var item_name = requestBody.itemName;

            var item_id = requestBody.itemId;

            var loc_id = requestBody.locId;

            var serial_lot = requestBody.serialLot;

            var serial_lot_search = createSerialLotBinSearch(item_id, loc_id, serial_lot);

            serial_lot_search.run().each(function (result) {
                serial_lot_numbers.push({
                    value: result.getValue('binnumber'),
                    label: result.getText('binnumber'),
                });
                return true;
            });

            return { serial_lots: serial_lot_numbers };
        }

        function createSerialLotBinSearch(item_id, loc_id, serial_lot) {

            var inventory_detail_search = search.create({
                type: "inventorynumberbin",
                filters:
                    [
                        ["inventorynumber.item", "anyof", item_id],
                        "AND",
                        ["quantityonhand", "greaterthan", "0"],
                        "AND",
                        ["location", "anyof", loc_id],
                        "AND",
                        ["inventorynumber", "is", serial_lot]
                    ],
                columns:
                    [
                        search.createColumn({ name: "binnumber", label: "Bin Number" })
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