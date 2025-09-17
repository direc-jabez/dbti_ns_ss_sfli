/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define([],

    function () {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            var locationDetailsRow = requestParams.locDetailsRow;

            return { locDetailsRow: locationDetailsRow };
        }

        return {
            'post': doPost
        };

    });