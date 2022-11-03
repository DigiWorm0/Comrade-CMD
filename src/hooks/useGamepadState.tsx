import React from 'react';
import GamepadState from '../types/GamepadState';
import { useCurrentGamepadID } from './useGamepad';

const GAMEPAD_POLL_RATE = 1000 / 20; // 20 FPS

export default function useGamepadState() {
    const [activeGamepadID] = useCurrentGamepadID();
    const [gamepadState, setGamepadState] = React.useState<GamepadState | undefined>(undefined);

    React.useEffect(() => {
        if (activeGamepadID) {
            const interval = setInterval(() => {
                const gamepads = navigator.getGamepads();
                const activeGamepad = gamepads.find((g) => g?.id === activeGamepadID);
                if (activeGamepad) {
                    setGamepadState({
                        axes: [...activeGamepad.axes],
                        buttons: [...activeGamepad.buttons],
                    });
                }
            }, GAMEPAD_POLL_RATE);

            return () => clearInterval(interval);
        }
    }, [activeGamepadID]);

    return gamepadState;
}