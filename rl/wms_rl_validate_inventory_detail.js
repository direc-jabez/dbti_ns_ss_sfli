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

            var updating = requestParams.updating;

            var inv_detail_index = requestParams.index;

            var fulfillArray = requestParams.fulfillArray;

            var item_name = requestParams.fullfillItem.fullfillItem;

            var item_id = requestParams.fullfillItem.fullfillItemId;

            var loc_id = getLocationId(requestParams.loc_id);

            var serial_lot_number = requestParams.serialLotNumber_dd.label;

            var bin = requestParams.bin.label;

            var line = requestParams.fullfillItem.line;

            var maxQty = requestParams.maxQty;

            var inv_detail_qty = requestParams.invDetailQty;

            var { serial_lot_number_valid, serial_lot_number_id, bin_valid, bin_id } = validateSerialLotAndBin(item_id, loc_id, serial_lot_number, bin);

            if (!serial_lot_number_valid || !bin_valid) {
                throw 'Invalid Serial/Lot or bin number.';
            }

            if (inv_detail_qty === 0) {
                throw 'Quantity must be greater than zero.';
            } else if (!inv_detail_qty) {
                throw 'Quantity is required.';
            }

            if (updating == "true") {

                log.debug('before update', fulfillArray[parseInt(inv_detail_index)]);

                fulfillArray[parseInt(inv_detail_index)] = {
                    ...fulfillArray[parseInt(inv_detail_index)],
                    'serial_lot_obj': {
                        value: serial_lot_number_id,
                        label: serial_lot_number,
                    },
                    'serial_lot_number': serial_lot_number,
                    'serial_lot_number_id': serial_lot_number_id,
                    'bin_obj': {
                        value: bin_id,
                        label: bin,
                    },
                    'bin': bin,
                    'bin_id': bin_id,
                    'inv_detail_qty': inv_detail_qty,
                };

                log.debug('after update', fulfillArray[parseInt(inv_detail_index)]);

            } else {

                var index = fulfillArray.length === 0 ? 0 : fulfillArray?.length - 1;

                fulfillArray.push({
                    'index': index,
                    'line': line,
                    'item_id': item_id,
                    'item_name': item_name,
                    'qty': maxQty,
                    'serial_lot_obj': {
                        value: serial_lot_number_id,
                        label: serial_lot_number,
                    },
                    'serial_lot_number': serial_lot_number,
                    'serial_lot_number_id': serial_lot_number_id,
                    'bin_obj': {
                        value: bin_id,
                        label: bin,
                    },
                    'bin': bin,
                    'bin_id': bin_id,
                    'inv_detail_qty': inv_detail_qty,
                });

            }

            return { fulfillArray: fulfillArray };

        }

        function validateSerialLotAndBin(item_id, loc_id, serial_lot_number, bin) {

            var serial_lot_number_id = '', bin_id = '';

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
                        ["inventorynumber", "is", serial_lot_number],
                        "AND",
                        ["binnumber.binnumber", "is", bin]
                    ],
                columns:
                    [
                        search.createColumn({ name: "inventorynumber", label: "Inventory Number" }),
                        search.createColumn({ name: "binnumber", label: "Bin Number" }),
                        search.createColumn({ name: "location", label: "Location" })
                    ]
            });

            var search_result_count = inventory_detail_search.runPaged().count;

            if (search_result_count == 0) {
                return {
                    'serial_lot_number_valid': false,
                    'serial_lot_number_id': 0,
                    'bin_valid': false,
                    'bin_id': 0
                };
            }

            inventory_detail_search.run().each(function (result) {
                serial_lot_number_id = result.getValue('inventorynumber');
                bin_id = result.getValue('binnumber');
                return true;
            });

            return {
                'serial_lot_number_valid': true,
                'serial_lot_number_id': serial_lot_number_id,
                'bin_valid': true,
                'bin_id': bin_id
            };

        }

        function getLocationId(loc_id) {

            var location_id = '';

            var location_search = search.create({
                type: "location",
                filters:
                    [
                        ["internalid", "anyof", loc_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            location_search.run().each(function (result) {
                location_id = result.id;
                return true;
            });

            return location_id;

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