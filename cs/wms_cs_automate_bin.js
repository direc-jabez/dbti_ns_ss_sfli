var serialLotOnChangeRegistered = false;

function registerSerialLotOnChange() {
    document.querySelectorAll('.dropdown__container').forEach(container => {
        const labelEl = container.querySelector('.dropdown__label');
        const selectedValueEl = container.querySelector('.dropdown__selected_value');
        if (!labelEl || !selectedValueEl) return;
        const labelText = labelEl.textContent.trim().toUpperCase();
        if (labelText !== 'SERIAL/LOT') return;
        const onSerialLotChange = () => {
            var dataRecord = mobile.getRecordFromState();
            var itemName = dataRecord.scriptParams.fullfillItem.fullfillItem;
            var itemId = dataRecord.scriptParams.fullfillItem.fullfillItemId;
            var locId = dataRecord.auxParams.warehouseLocation_LocationTbl.id;
            var selectedSerialLot = mobile.getValueFromPage('SFLI_IF_Fulfill_Items_Configure_Line_Lot_Serial_Number_DD').label;
            fetch('/app/site/hosting/restlet.nl?script=4032&deploy=1', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemName: itemName,
                    itemId: itemId,
                    locId: locId,
                    serialLot: selectedSerialLot
                })
            }).then(res => res.json()).then(data => {
                console.log('Received from RESTlet:', data);
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
    clientFunctions.onSelect = function () {
        if (!serialLotOnChangeRegistered) {
            registerSerialLotOnChange();
            triggerOnSerialLotChange();
        }
    };
    return clientFunctions;
})();