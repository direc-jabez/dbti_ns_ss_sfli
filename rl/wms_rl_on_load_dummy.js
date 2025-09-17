/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        /**
         * This function is to fetch the items of a purchase order
         */
        function doPost(requestBody) {

            return { dummy: [] };

        }
        
        return {
            'post': doPost
        };

    });