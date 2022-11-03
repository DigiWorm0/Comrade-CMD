import { atom, useAtomValue, useAtom } from 'jotai';
import React from 'react';
import { useLogInfo } from './useLog';

export const gamepadsAtom = atom<Gamepad[]>([]);

export function _useGamepads() {
    const logInfo = useLogInfo();
    const [gamepads, setGamepads] = useAtom(gamepadsAtom);

    const onGamepadConnected = React.useCallback((e: GamepadEvent) => {
        const gamepad = e.gamepad;
        setGamepads((controllers) => [...controllers, gamepad]);
        logInfo(`Gamepad connected:\n${gamepad.id}`);
    }, [setGamepads, logInfo]);

    const onGamepadDisconnected = React.useCallback((e: GamepadEvent) => {
        const gamepad = e.gamepad;
        setGamepads((controllers) => controllers.filter((c) => c.index !== gamepad.index));
        logInfo(`Gamepad disconnected:\n${gamepad.id}`);
    }, [setGamepads, logInfo]);

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