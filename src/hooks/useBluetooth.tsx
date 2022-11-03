import { atom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import BTConnection from "../types/BTConnection";
import useGamepadState from "./useGamepadState";
import { useLogError, useLogInfo } from "./useLog";

const BT_NAME = 'ComradeBT';
const BT_MOTOR_SERVICE = "1e4bb5ae-307f-46cb-acdc-90558449f3f2";
const BT_DRIVE_CHARACTERISTIC = "02d47e08-db20-4541-b8fd-fc269e38246b";
const BT_STEER_CHARACTERISTIC = "02f58f96-4dc5-4c17-b4f9-eb9dc3c2be90";

export const btAtom = atom<BTConnection | undefined>(undefined);

export function useSetBT() {
    return useSetAtom(btAtom);
}

export default function useBT() {
    return useAtomValue(btAtom);
}

async function _connectBTDevice() {
    const device = await navigator.bluetooth.requestDevice({
        filters: [
            { name: BT_NAME },
            { services: [BT_MOTOR_SERVICE] },
        ],
    });
    const server = await device.gatt?.connect();
    const service = await server?.getPrimaryService(BT_MOTOR_SERVICE);
    const drive = await service?.getCharacteristic(BT_DRIVE_CHARACTERISTIC);
    const steer = await service?.getCharacteristic(BT_STEER_CHARACTERISTIC);

    if (service === undefined || server === undefined || drive === undefined || steer === undefined) {
        throw new Error("Failed to connect to bluetooth device.");
    }

    const btConnection: BTConnection = {
        _device: device,
        _server: server,
        _service: service,
        drive,
        steer,
    };

    return btConnection;
}

export function useConnectBTDevice() {
    const logInfo = useLogInfo();
    const logError = useLogError();
    const setBT = useSetBT();

    const connectBTDevice = React.useCallback(async () => {
        if (navigator.bluetooth === undefined) {
            alert("Web Bluetooth is not supported in this browser.");
            return;
        }

        try {
            logInfo("Searching for bluetooth devices...");
            const connection = await _connectBTDevice();
            setBT(connection);
            logInfo("Connected to bluetooth device.");
        } catch (error) {
            logError("Failed to connect to bluetooth device.\n" + error);
        }
    }, [logError, logInfo, setBT]);

    return connectBTDevice;
}

export function useDisconnectBTDevice() {
    const logInfo = useLogInfo();
    const setBT = useSetBT();
    const bt = useBT();

    const disconnectBTDevice = React.useCallback(() => {
        if (bt === undefined) {
            return;
        }

        bt._device.gatt?.disconnect();
        setBT(undefined);
        logInfo("Disconnected from bluetooth device.");
    }, [bt, logInfo, setBT]);

    return disconnectBTDevice;
}

export function _useBTComms() {
    const logError = useLogError();
    const setBT = useSetBT();
    const activeGamepadState = useGamepadState();
    const bt = useBT();

    const _uploadBTComms = React.useCallback(async () => {
        if (bt === undefined) {
            return;
        }
        const { drive, steer } = bt;
        if (!activeGamepadState) {
            await drive.writeValue(new Uint8Array([0]));
            await steer.writeValue(new Uint8Array([0]));
        }
        else {
            const { axes } = activeGamepadState;
            const driveVal = -axes[1] * 127 + 127;
            const steerVal = axes[0] * 127 + 127;
            await drive.writeValue(new Uint8Array([driveVal]));
            await steer.writeValue(new Uint8Array([steerVal]));
        }
    }, [activeGamepadState, bt]);

    React.useEffect(() => {
        if (bt === undefined) {
            return;
        }
        _uploadBTComms().catch((error) => {
            //logError("Failed to upload bluetooth comms.\n" + error);
        });
    }, [bt, logError, setBT, _uploadBTComms]);

    const onDisconnected = React.useCallback((event: Event) => {
        const device = event.target as BluetoothDevice;
        if (device === bt?._device) {
            logError("Bluetooth device disconnected.");
            setBT(undefined);
        }
    }, [bt, logError, setBT]);

    React.useEffect(() => {
        if (bt === undefined) {
            return;
        }
        bt._device.addEventListener('gattserverdisconnected', onDisconnected);
        return () => {
            bt._device.removeEventListener('gattserverdisconnected', onDisconnected);
        };
    }, [bt, onDisconnected]);

    return null;
}