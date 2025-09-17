/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define([],

    function () {

        function doPost(requestBody) {

            return {
                updating: false,
                serial_lot_obj: {},
                serial_lot_number: '',
                maxQty: null,
                inv_detail_qty: null,
                inventoryDetails: null,
                index: null,
                fullfillItem: {},
                fulfillArray: [],
                checkedBy: '',
                released_by: '',
                bin_obj: {},
                bin: '',
            };
        }

        return {
            'post': doPost
        };

    });