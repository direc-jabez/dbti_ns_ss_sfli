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

            var locList = [];

            var location_search = createLocationSearch();

            location_search.run().each(function (result) {

                locList.push({
                    locationName: result.getValue('name'),
                });

                return true;

            });

            return { locationList: locList };

        }

        function createLocationSearch() {

            var location_search = search.create({
                type: "location",
                filters:
                    [
                        ["isinactive", "is", "F"],
                        "AND",
                        ["subsidiary", "anyof", "14"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "Name" }),
                        search.createColumn({ name: "internalid", label: "Internal ID" })
                    ]
            });

            return location_search;
        }

        return {
            'post': doPost
        };

    });