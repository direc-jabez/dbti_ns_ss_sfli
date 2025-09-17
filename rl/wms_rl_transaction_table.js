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

            var selectedLoc = requestParams.locationTxt;

            var loc_id = getLocationIdByName(selectedLoc);

            let searchObj = createSubsidiaryWithLocationSearch(loc_id)

            let transactionFilteredArray = [];

            searchObj.run().each(function (result) {

                transactionFilteredArray.push({
                    tranID: result.getValue('tranid'),
                    location: result.getText('location')
                })

                return true;
            });

            log.debug('selectedLoc', selectedLoc);
            log.debug('selectedSub', selectedSub);
            log.debug('transactionFilteredArray', transactionFilteredArray);

            return {
                TransactionTable: transactionFilteredArray,
                sum: 1000
            };
        }

        function getLocationIdByName(loc_name) {

            var loc_id = '';

            var locationSearchObj = search.create({
                type: "location",
                filters:
                    [
                        ["name", "is", loc_name]
                    ],
                columns: [],
            });

            locationSearchObj.run().each(function (result) {
                loc_id = result.id;
                return true;
            });

            return loc_id;
        }

        function createSubsidiaryWithLocationSearch(locationId) {
            var transactionSearchObj = search.create({
                type: "transaction",
                settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                filters:
                    [
                        ["type", "anyof", "SalesOrd", "PurchOrd"],
                        "AND",
                        ["subsidiary", "anyof", "14"],
                        "AND",
                        ["trandate", "within", "thisyear"],
                        "AND",
                        ["location", "anyof", locationId],
                        "AND",
                        ["mainline", "is", "T"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "location", label: "Location" })
                    ]
            });

            return transactionSearchObj
        }



        return {
            'post': doPost
        };

    });