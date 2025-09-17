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

            var requestParams = requestBody.params;

            var loc_id = requestParams.locDetailsRow;

            log.debug('loc_id', loc_id);

            var soList = [];

            var sales_order_search = createSalesOrderSearch(loc_id);

            sales_order_search.run().each(function (result) {

                soList.push({
                    salesOrderActualNumber: result.getValue('tranid'),
                    customer: result.getText('entity'),
                    memo: result.getValue('memo')
                });

                return true;

            });

            return { 
                salesOrderList: soList };

        }

        function createSalesOrderSearch(loc_id) {

            var sales_order_search = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["subsidiary", "anyof", "14"], // 14 is SuperFlex subsidiary
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["status", "anyof", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E"],
                        "AND",
                        ["location", "anyof", loc_id]
                    ],
                columns:
                    [
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "memo", label: "Memo" }),
                    ]
            });

            return sales_order_search;
        }

        return {
            'post': doPost
        };

    });