import useGamepadState from "./useGamepadState";

const AXIS_THRESHOLD = 0.1;

export default function useGamepadActive() {
    const gamepadState = useGamepadState();

    const isButtonDown = gamepadState?.buttons.some((button) => button.pressed) ?? false;
    const isAxisDown = gamepadState?.axes.some((axis) => Math.abs(axis) > AXIS_THRESHOLD) ?? false;

    return isButtonDown || isAxisDown;
}