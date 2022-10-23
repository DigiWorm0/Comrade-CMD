import { atom, useAtom } from "jotai";
import { gamepadsAtom } from "./useGamepads";

export const currentGamepadIDAtom = atom<string | undefined>(undefined);
export const currentGamepadAtom = atom(
    (get) => {
        const gamepads = get(gamepadsAtom);
        const activeGamepadID = get(currentGamepadIDAtom);
        return gamepads.find((gamepad) => gamepad.id === activeGamepadID);
    }, (get, set, id: string | undefined) => {
        set(currentGamepadIDAtom, id);
    }
);

export default function useCurrentGamepad() {
    return useAtom(currentGamepadAtom);
}

export function useCurrentGamepadID() {
    return useAtom(currentGamepadIDAtom);
}