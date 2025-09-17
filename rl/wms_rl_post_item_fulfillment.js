/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/record', 'N/search', 'N/format'],

    function (record, search, format) {

        function doPost(requestBody) {

            try {

                var requestParams = requestBody.params;

                var released_by_id = getEmployeeIdByName(requestParams.releasedBy);

                log.debug('released_by_id', released_by_id);

                if (!released_by_id) {
                    throw 'Invalid employee name. (Released By)';
                }

                var checked_by_id = getEmployeeIdByName(requestParams.checkedBy);

                log.debug('checked_by_id', checked_by_id);

                if (!checked_by_id) {
                    throw 'Invalid employee name. (Checked By)';
                }

                // var date = requestParams.date;

                // log.debug('date', date);

                // if (!date) {
                //     throw 'Date is required.';
                // } else {
                //     try {

                //         var is_date_valid = isValidDateMDY(date);

                //     } catch (error) {

                //     }

                //     log.debug('is_date_valid', is_date_valid);

                //     if (!is_date_valid) {

                //         log.debug('not valid', 'not valid');

                //         throw 'Date is invalid.';

                //     }
                // }

                // var forex = requestParams.forex;

                // if (!forex) {
                //     throw 'Forex is required.';
                // }

                var forex_id = getForexIdByDate();

                log.debug('forex_id', forex_id);

                if (!forex_id) {
                    throw 'Invalid Forex date.';
                }

                var so_doc_num = requestParams.salesOrderActualNumber;

                log.debug('so_doc_num', so_doc_num);

                var so_id = getSalesOrderIdByName(so_doc_num);

                log.debug('so_id', so_id);

                var fulfillArray = requestParams.fulfillArray;

                log.debug('fulfillArray typeof', typeof fulfillArray);

                log.debug('fulfillArray length', typeof fulfillArray.length);

                log.debug('fulfillArray length', fulfillArray.length);

                if (fulfillArray.length == 0) {
                    throw 'Please configure inventory details for the items.';
                }

                var dr_number = createItemFulfillmentFromSalesOrderId(so_id, released_by_id, checked_by_id, forex_id, fulfillArray);

                return { itemFulfillmentNumber: dr_number };

            } catch (error) {

                throw error;

            }
        }

        function getSalesOrderIdByName(so_doc_num) {

            var so_id = '';

            var sales_order_search = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["subsidiary", "anyof", "14"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["status", "anyof", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E"],
                        "AND",
                        ["numbertext", "is", so_doc_num]
                    ],
                columns: []
            });

            sales_order_search.run().each(function (result) {
                so_id = result.id;
                return true;
            });

            return so_id;

        }

        function getEmployeeIdByName(name) {

            var emp_id = '';

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["entityid", "is", name]
                    ],
                columns: [],
            });


            employee_search.run().each(function (result) {
                emp_id = result.id;
                return true;
            });

            return emp_id;
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

        function getForexIdByDate() {

            var forex_id = '';

            var forex_search = search.create({
                type: "customrecord178",
                filters:
                    [
                        ["custrecord167", "on", "today"]
                    ],
                columns:
                    [
                    ]
            });

            forex_search.run().each(function (result) {
                forex_id = result.id;
                return true;
            });

            return forex_id;

        }

        function createItemFulfillmentFromSalesOrderId(so_id, released_by_id, checked_by_id, forex_id, fulfillArray) {

            var item_fulfillment_rec = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: so_id,
                toType: record.Type.ITEM_FULFILLMENT,
                isDynamic: true
            });

            item_fulfillment_rec.setValue('customform', '123');

            item_fulfillment_rec.setValue('custbody7', released_by_id);

            item_fulfillment_rec.setValue('custbody2', checked_by_id);

            item_fulfillment_rec.setValue('custbody104', forex_id);

            var items_lines = item_fulfillment_rec.getLineCount({
                sublistId: 'item'
            });

            log.debug('items_lines', items_lines);

            for (var line = 0; line < items_lines; line++) {

                var item = item_fulfillment_rec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: line,
                });

                var line_id = item_fulfillment_rec.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'line',
                    line: line,
                });

                log.debug('line_id', line_id);

                log.debug('fulfillArray', fulfillArray);

                var inventory_details = getItemInventoryDetails(item, line_id, fulfillArray);

                log.debug('inventory_details', inventory_details);

                if (inventory_details.length > 0) {

                    var qty_not_valid = validateQuantity(inventory_details);

                    log.debug('qty_valid', qty_not_valid);

                    if (qty_not_valid) {
                        throw 'The total inventory detail quantity must be ' + inventory_details[0].qty + '.';
                    }

                    log.debug('line', line);

                    item_fulfillment_rec.selectLine({
                        sublistId: 'item',
                        line: line,
                    });

                    item_fulfillment_rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'itemreceive',
                        value: true,
                        forceSyncSourcing: true,
                    });

                    item_fulfillment_rec.setCurrentSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        value: inventory_details[0].qty,
                        forceSyncSourcing: true,
                    });

                    inventory_details.forEach(inventory_detail => {
                        setInventoryDetails(item_fulfillment_rec, inventory_detail.serial_lot_number_id, inventory_detail.bin_id, inventory_detail.inv_detail_qty);
                    });

                    item_fulfillment_rec.commitLine({
                        sublistId: 'item',
                    });
                }

            }

            var if_id = item_fulfillment_rec.save({
                ignoreMandatoryFields: true,
            });

            log.debug('if_id', 'Create Item Fulfillment with ID: ' + if_id);

            var dr_number = getDeliveryReceiptNumber(if_id);

            return dr_number;

        }

        function validateQuantity(inventory_details) {

            var max_qty = inventory_details[0]?.qty;

            const totalInvDetailQty = inventory_details.reduce((sum, entry) => sum + entry.inv_detail_qty, 0);

            // Qty not valud if totalInvDetailQty is less than max_Qty
            return totalInvDetailQty != max_qty;

        }

        function setInventoryDetails(item_fulfillment_rec, serial_lot_number, bin, quantity) {

            var inventory_detail = item_fulfillment_rec.getCurrentSublistSubrecord({
                sublistId: 'item',
                fieldId: 'inventorydetail',
                ignoreRecalc: true
            });

            log.debug('quantity', inventory_detail.getValue('quantity'));

            inventory_detail.selectNewLine({
                sublistId: 'inventoryassignment'
            });

            inventory_detail.setCurrentSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'issueinventorynumber',
                value: serial_lot_number,
                forceSyncSourcing: true,
            });

            inventory_detail.setCurrentSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'binnumber',
                value: bin,
                forceSyncSourcing: true,
            });

            inventory_detail.setCurrentSublistValue({
                sublistId: 'inventoryassignment',
                fieldId: 'quantity',
                value: quantity,
                forceSyncSourcing: true,
            });

            inventory_detail.commitLine({
                sublistId: 'inventoryassignment'
            });

            log.debug('message', 'Committed');
        }

        function getItemInventoryDetails(item, line, fulfillArray) {

            var inventory_details = fulfillArray.filter(fulfill => fulfill.line === line && fulfill.item_id === item);

            return inventory_details;

        }

        function getDeliveryReceiptNumber(if_id) {

            var if_fieldLookUp = search.lookupFields({
                type: search.Type.ITEM_FULFILLMENT,
                id: if_id,
                columns: ['custbody31']
            });

            return if_fieldLookUp['custbody31']; // Returning the DR #.

        }

        return {
            'post': doPost
        };

    });