var serialLotOnChangeRegistered = false;
var initialized = false;


function registerSerialLotOnChange() {
    document.querySelectorAll('.dropdown__container').forEach(container => {
        const labelEl = container.querySelector('.dropdown__label');
        const selectedValueEl = container.querySelector('.dropdown__selected_value');
        if (!labelEl || !selectedValueEl) return;
        const labelText = labelEl.textContent.trim().toUpperCase();
        if (labelText !== 'SERIAL/LOT') return;
        const onSerialLotChange = () => {
            try {
                var dataRecord = mobile.getRecordFromState();
                var itemName = dataRecord.scriptParams.fullfillItem.fullfillItem;
                var locId = dataRecord.auxParams.warehouseLocation_LocationTbl.id;
                var selectedSerialLot = mobile.getValueFromPage('SFLI_IF_Fulfill_Items_Configure_Line_Lot_Serial_Number_DD')?.label;
                if (selectedSerialLot) {
                    fetch('/app/site/hosting/restlet.nl?script=3300&deploy=1', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            itemName: itemName,
                            locId: locId,
                            serialLot: selectedSerialLot
                        })
                    }).then(res => res.json()).then(data => {
                        console.log(data);
                        mobile.setElementSourceData(
                            'SFLI_IF_Fulfill_Items_Configure_Line_Bin_DD',
                            data.serial_lots,
                        );
                        mobile.setValueInPage(
                            'SFLI_IF_Fulfill_Items_Configure_Line_Bin_DD',
                            data.serial_lots[0],
                        );
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }
        window.triggerOnSerialLotChange = onSerialLotChange;
        const observer = new MutationObserver(onSerialLotChange);
        observer.observe(selectedValueEl, {
            characterData: true,
            childList: true,
            subtree: true
        });
    });
    serialLotOnChangeRegistered = true;
}

(function () {
    var clientFunctions = {};
    clientFunctions.onLoad = function () {
        var dataRecord = mobile.getRecordFromState();
        var updating = dataRecord.scriptParams.updating;
        if (updating == "true") {
            try {
                var serialLotObj = dataRecord.scriptParams.serial_lot_obj;
                var binObj = dataRecord.scriptParams.bin_obj;
                mobile.setValueInPage(
                    'SFLI_IF_Fulfill_Items_Configure_Line_Lot_Serial_Number_DD',
                    serialLotObj,
                );
                var itemName = dataRecord.scriptParams.fullfillItem.fullfillItem;
                var locId = dataRecord.auxParams.warehouseLocation_LocationTbl.id;
                var selectedSerialLot = mobile.getValueFromPage('SFLI_IF_Fulfill_Items_Configure_Line_Lot_Serial_Number_DD').label;
                fetch('/app/site/hosting/restlet.nl?script=3300&deploy=1', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        itemName: itemName,
                        locId: locId,
                        serialLot: selectedSerialLot
                    })
                }).then(res => res.json()).then(data => {
                    console.log(data);
                    mobile.setElementSourceData(
                        'SFLI_IF_Fulfill_Items_Configure_Line_Bin_DD',
                        data.serial_lots,
                    );
                    mobile.setValueInPage(
                        'SFLI_IF_Fulfill_Items_Configure_Line_Bin_DD',
                        binObj,
                    );
                    registerSerialLotOnChange();
                });
            } catch (error) {
                console.log(error);
            }
        } else {
            if (!serialLotOnChangeRegistered) {
                registerSerialLotOnChange();
                triggerOnSerialLotChange();
            }
        }
    };
    return clientFunctions;
})();