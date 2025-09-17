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

            var item = requestParams.fullfillItem.fullfillItem;

            var item_line = requestParams.fullfillItem.line;

            var fulfillArray = requestParams.fulfillArray;

            var qty = requestParams.qty;

            if (fulfillArray.length > 0) {

                if (qty === 0) {
                    // throw 'Quantity must be greater than zero.'
                } else if (!qty) {
                    // throw 'Quantity is required.'
                }

                fulfillArray.forEach(obj => {
                    if (obj.item_name === item && obj.line === item_line) {
                        obj.qty = qty;
                    }
                });

            }

            return { fulfillArray: fulfillArray };

        }

        return {
            'post': doPost
        };

    });