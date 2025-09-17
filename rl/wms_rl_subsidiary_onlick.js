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

            var location = requestParams.locationTxt;

            log.debug('isLocationExists', isLocationExists(location));

            if (!isLocationExists(location)) {
                throw "Location does not exist.";
            }

        }

        function isLocationExists(loc_name) {

            var locationSearchObj = search.create({
                type: "location",
                filters:
                    [
                        ["name", "is", loc_name]
                    ],
                columns: [],
            });

            var loc_search_result_count = locationSearchObj.runPaged().count;

            log.debug();

            return loc_search_result_count > 0;
        }

        return {
            'post': doPost
        };

    });