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

            var maxQuantity = requestParams.maxQty;

            if (maxQuantity === 0) {
                throw 'Quantity must be greater than zero.'
            } else if (!maxQuantity) {
                throw 'Quantity is required.'

            }

            var inv_detail_index = requestParams.inventory_details?.index;

            var sl_num = requestParams.inventory_details?.serial_lot_number;

            var bin_code = requestParams.inventory_details?.bin;

            var inventory_detail_qty = requestParams.inventory_details?.inv_detail_qty;

            var is_updating = requestParams.updating;

            var inventory_detail_serial_lot_obj = requestParams.inventory_details?.serial_lot_obj;

            var inventory_detail_bin_obj = requestParams.inventory_details?.bin_obj;

            log.debug('toReturn', {
                serial_lot_number: sl_num,
                bin: bin_code,
                inv_detail_qty: inventory_detail_qty,
                maxQty: maxQuantity,
                index: inv_detail_index,
                updating: is_updating,
                serial_lot_obj: inventory_detail_serial_lot_obj,
                bin_obj: inventory_detail_bin_obj,
            });

            return {
                serial_lot_number: sl_num,
                bin: bin_code,
                inv_detail_qty: inventory_detail_qty,
                maxQty: maxQuantity,
                index: inv_detail_index,
                updating: is_updating,
                serial_lot_obj: inventory_detail_serial_lot_obj,
                bin_obj: inventory_detail_bin_obj,
            };
        }

        return {
            'post': doPost
        };

    });