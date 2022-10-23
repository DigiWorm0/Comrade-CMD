import { atom, useAtomValue, useAtom } from 'jotai';
import React from 'react';

export const gamepadsAtom = atom<Gamepad[]>([]);

export function _useGamepads() {
    const [gamepads, setGamepads] = useAtom(gamepadsAtom);

    const onGamepadConnected = React.useCallback((e: GamepadEvent) => {
        const gamepad = e.gamepad;
        setGamepads((controllers) => [...controllers, gamepad]);
        console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}. ${gamepad.buttons.length} buttons, ${gamepad.axes.length} axes.`);
    }, [setGamepads]);

    const onGamepadDisconnected = React.useCallback((e: GamepadEvent) => {
        const gamepad = e.gamepad;
        setGamepads((controllers) => controllers.filter((c) => c.index !== gamepad.index));
        console.log(`Gamepad disconnected from index ${gamepad.index}: ${gamepad.id}`);
    }, [setGamepads]);

    React.useEffect(() => {
        window.addEventListener("gamepadconnected", onGamepadConnected);
        window.addEventListener("gamepaddisconnected", onGamepadDisconnected);

        return () => {
            window.removeEventListener("gamepadconnected", onGamepadConnected);
            window.removeEventListener("gamepaddisconnected", onGamepadDisconnected);
        };
    }, [onGamepadConnected, onGamepadDisconnected]);

    return gamepads;
}

export default function useGamepads() {
    return useAtomValue(gamepadsAtom);
}