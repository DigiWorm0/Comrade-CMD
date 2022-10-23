import { atom, useAtomValue, useSetAtom } from "jotai";
import React from "react";
import useGamepadState from "./useGamepadState";

export const btAtom = atom<BluetoothRemoteGATTCharacteristic | undefined>(undefined);

export function useSetBT() {
    return useSetAtom(btAtom);
}

export default function useBT() {
    return useAtomValue(btAtom);
}

export function _useBTComms() {
    const activeGamepadState = useGamepadState();
    const bt = useAtomValue(btAtom);

    React.useEffect(() => {
        if (!bt) {
            return;
        }
        if (!activeGamepadState) {
            bt.writeValue(new Uint8Array([0]));
            return;
        }
        const { buttons, axes } = activeGamepadState;
        const buffer = new ArrayBuffer(1 + buttons.length + axes.length * 2);
        const view = new DataView(buffer);
        view.setUint8(0, 1);
        for (let i = 0; i < buttons.length; i++) {
            view.setUint8(1 + i, buttons[i] ? 1 : 0);
        }
        for (let i = 0; i < axes.length; i++) {
            view.setInt16(1 + buttons.length + i * 2, axes[i] * 32767, true);
        }
        bt.writeValue(new Uint8Array(buffer));
    }, [activeGamepadState, bt]);

    return bt;
}