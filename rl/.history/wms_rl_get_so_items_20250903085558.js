/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            var salesOrderActualNumber = requestParams.salesOrderActualNumber;

            var salesOrderItemList = [];

            var sales_order_item_search = createSalesOrderItemSearch(salesOrderActualNumber);

            sales_order_item_search.ru n().each(function (result) {

                salesOrderItemList.push({
                    fullfillItem: result.getText('item'),
                    fulfillItemDescription: result.getValue({ name: "salesdescription", join: "item" }),
                    fulfillItemDeliveryDate: result.getValue('custcol4'),
                    fulfillItemPONum: result.getValue('custcol2'),
                    line: result.getValue('line'),
                });

                return true;

            });

            return { soItemList: salesOrderItemList };

        }

        function createSalesOrderItemSearch(salesOrderActualNumber) {

            var sales_order_items_search = search.create({
                type: "salesorder",
                settings: [{ "name": "consolidationtype", "value": "ACCTTYPE" }],
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["subsidiary", "anyof", "14"],
                        "AND",
                        ["mainline", "is", "F"],
                        "AND",
                        ["status", "anyof", "SalesOrd:B", "SalesOrd:D", "SalesOrd:E"],
                        "AND",
                        ["taxline", "is", "F"],
                        "AND",
                        ["numbertext", "is", salesOrderActualNumber]
                    ],
                columns:
                    [
                        search.createColumn({ name: "item", label: "Item" }),
                        search.createColumn({
                            name: "salesdescription",
                            join: "item",
                            label: "Description"
                        }),
                        search.createColumn({ name: "custcol4", label: "Delivery Date" }),
                        search.createColumn({ name: "custcol2", label: "PO #" }),
                        search.createColumn({ name: "line", label: "Line ID" })
                    ]
            });

            return sales_order_items_search;
        }

        return {
            'post': doPost
        };

    });