/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define([''],

    function () {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            log.debug('requestParams', requestParams);

            var serial_lot_number = requestParams.serial_lot.label;

            return { serial_lot: serial_lot_number };
        }

        return {
            'post': doPost
        };

    });