/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define([],

    function () {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            var soDetailsRow = requestParams.soDetailsRow;

            var so_id = soDetailsRow.salesOrderActualNumber;

            log.debug('soDetailsRow', soDetailsRow);

            if (!so_id) {
                throw "Error";
            }

            return {
                salesOrderActualNumber: so_id,
                fulfillArray: [],
            };
        }

        return {
            'post': doPost
        };

    });