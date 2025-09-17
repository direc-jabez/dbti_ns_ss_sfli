/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */

define(['N/search', 'N/record', 'N/format'],

    function (search, record, format) {

        function onRequest(context) {

            var is_date_valid = isValidDateMDY('test');

            log.debug('is_date_valid', is_date_valid);

            var is_date_valid = isValidDateMDY('5/1/2025');

            log.debug('is_date_valid', is_date_valid);

            var parse_date = format.parse({
                value: 'test',
                type: format.Type.DATE
            });

            log.debug('parse_date', parse_date);

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
                        ["status", "anyof", "SalesOrd:D", "SalesOrd:B"],
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

        function createItemFulfillmentFromSalesOrderId(so_id, fulfillArray) {

            var item_fulfillment_rec = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: so_id,
                toType: record.Type.ITEM_FULFILLMENT,
                isDynamic: true
            });

            item_fulfillment_rec.setValue('customform', '123');

            item_fulfillment_rec.setValue('custbody7', '14546');

            item_fulfillment_rec.setValue('custbody2', '81977');

            item_fulfillment_rec.setValue('custbody104', '5321');

            var parse_date = format.parse({
                value: '5/1/2025',
                type: format.Type.DATE
            });

            item_fulfillment_rec.setValue('trandate', parse_date);

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

                var inventory_details = getItemInventoryDetails(item, line_id, fulfillArray);

                log.debug('inventory_details', inventory_details);

                if (inventory_details.length > 0) {

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
                        setInventoryDetails(item_fulfillment_rec, line, inventory_detail.serial_lot_number_id, inventory_detail.bin_id, inventory_detail.inv_detail_qty);
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

        }

        function setInventoryDetails(item_fulfillment_rec, line, serial_lot_number, bin, quantity) {

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

        function getItemAndLineIdIndex() {

        }

        return {
            onRequest: onRequest
        }
    }
);