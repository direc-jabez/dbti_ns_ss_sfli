/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        function doPost(requestBody) {

            log.debug('flag', true);

            var employee_search = createEmployeeSearch();

            var employees = [];

            employee_search.run().each(function (result) {
                employees.push({
                    id: result.id,
                    name: result.getValue("entityid"),
                });
                return true;
            });

            return {
                supervisorList: employees,
            };
        }

        function createEmployeeSearch() {

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["internalid", "anyof", "1502", "762", "8551"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "entityid", label: "Name" })
                    ]
            });

            return employee_search;
        }

        return {
            'post': doPost
        };

    });