/// <reference types="web-bluetooth" />

import { Button } from "@blueprintjs/core";
import React from "react";
import useBT, { useSetBT } from "../../hooks/useBluetooth";
import { useLogError, useLogInfo } from "../../hooks/useLog";

const BT_PREFIX = 'ARDUINO_';
const BT_SERVICE = 0xFFE0;
const BT_CHARACTERISTIC = 0xFFE1;

export default function BluetoothMenu() {
    const logError = useLogError();
    const logInfo = useLogInfo();
    const setBT = useSetBT();
    const bt = useBT();

    const onConnectBluetooth = React.useCallback(() => {
        if (navigator.bluetooth === undefined) {
            alert("Web Bluetooth is not supported in this browser.");
            return;
        }

        navigator.bluetooth.requestDevice({
            filters: [
                { namePrefix: BT_PREFIX },
                { services: [BT_SERVICE] }
            ],
        })
            .then(device => {
                logInfo(`Connecting to ${device.name}...`);
                return device.gatt?.connect();
            })
            .then(server => {
                logInfo(`Connected to ${server?.device.name}`);
                return server?.getPrimaryService(BT_SERVICE);
            })
            .then(service => {
                logInfo(`Service: ${service?.uuid}`);
                return service?.getCharacteristic(BT_CHARACTERISTIC);
            })
            .then(characteristic => {
                logInfo(`Characteristic: ${characteristic?.uuid}`);
                setBT(characteristic);
                characteristic?.addEventListener('characteristicvaluechanged', (event) => {
                    const logMessage = new TextDecoder().decode((event.target as BluetoothRemoteGATTCharacteristic).value);
                    logInfo("Recieved message from device:\n" + logMessage);
                });
                return characteristic?.startNotifications();
            }).catch(error => {
                logError("Failed to connect to bluetooth device.\n" + error);
            });
    }, [logError, logInfo, setBT]);

    return (
        <div style={{
            height: "100%",
            width: "100%",

            padding: 5,

            overflowY: "auto",
            overflowX: "hidden",
        }}>
            <h1>Bluetooth</h1>
            {bt ? (
                <>

                </>
            ) : (
                <Button
                    fill
                    icon="link"
                    text="Pair Bluetooth Device"
                    onClick={onConnectBluetooth}
                />
            )}
        </div>
    );
}