/**
 * @NApiVersion 2.1
 * @NScriptType Restlet
 * @NModuleScope public
 */
define(['N/search'],

    function (search) {

        function doPost(requestBody) {

            var requestParams = requestBody.params;

            var selectedEmp = requestParams.selectedEmployee;

            var employee_search = createEmployeeSearch(selectedEmp);

            var employees = [];

            employee_search.run().each(function (result) {
                employees.push({
                    id: result.id,
                    name: result.getValue("entityid"),
                });
                return true;
            });

            return {
                employeeList: employees,
            };
        }

        function createEmployeeSearch(selected_emp_id) {

            var employee_search = search.create({
                type: "employee",
                filters:
                    [
                        ["supervisor", "anyof", selected_emp_id]
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