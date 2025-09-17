/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        function doPost(requestBody) {

            var requestParams = requestBody.params;
            // var selectedEmp = requestParams.selectedEmployee;


            let locationObj = createLocationSearch();
            let subsidiaryObj = createSubsidiarySearch()

            let locationArray = [];
            locationObj.run().each(function (result) {
                locationArray.push({
                    id: result.id,
                    name: result.getValue('name')
                })

                return true;
            });


            let subsidiaryArray = [];
            subsidiaryObj.run().each(function (result) {
                subsidiaryArray.push({
                    id: result.id,
                    name: result.getValue('name')
                })

                return true;
            });

            log.debug('subsidiaryArray', subsidiaryArray);
            log.debug('locationArray', locationArray);

            return {    
                locationSelect: locationArray,
                subsidiarySelect: subsidiaryArray,
            };
        }

        function createSubsidiarySearch() {
            var subsidiarySearchObj = search.create({
                type: "subsidiary",
                filters:
                    [
                        ["country", "anyof", "PH"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "Name" }),
                        search.createColumn({ name: "city", label: "City" }),
                        search.createColumn({ name: "state", label: "State/Province" }),
                        search.createColumn({ name: "country", label: "Country" }),
                        search.createColumn({ name: "currency", label: "Currency" }),
                        search.createColumn({ name: "custrecord_company_brn", label: "BRN" }),
                        search.createColumn({ name: "custrecord_company_uen", label: "UEN" })
                    ]
            });

            return subsidiarySearchObj;
        }


        function createLocationSearch() {

            var locationSearchObj = search.create({
                type: "location",
                filters:
                    [
                        ["country", "anyof", "PH"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "Name" }),
                        search.createColumn({ name: "phone", label: "Phone" }),
                        search.createColumn({ name: "city", label: "City" }),
                        search.createColumn({ name: "state", label: "State/Province" }),
                        search.createColumn({ name: "country", label: "Country" })
                    ]
            });
            var searchResultCount = locationSearchObj.runPaged().count;
            log.debug("locationSearchObj result count", searchResultCount);


            return locationSearchObj

        }


        return {
            'post': doPost
        };

    });