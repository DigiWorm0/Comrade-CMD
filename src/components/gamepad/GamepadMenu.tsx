import { Icon, Menu, MenuItem } from "@blueprintjs/core";
import useCurrentGamepad from "../../hooks/useGamepad";
import useGamepadActive from "../../hooks/useGamepadActive";
import useGamepads from "../../hooks/useGamepads";
import GamepadDebug from "./GamepadDebug";

export default function GamepadMenu() {
    const gamepads = useGamepads();
    const [activeGamepad, setActiveGamepadID] = useCurrentGamepad();
    const isGamepadActive = useGamepadActive();

    return (
        <div style={{
            height: "100%",
            width: "100%",

            padding: 5,

            overflowY: "auto",
            overflowX: "hidden",
        }}>
            <h1>Gamepads</h1>
            <Menu>
                {gamepads.map((gamepad) => (
                    <div key={gamepad.id}>
                        <MenuItem
                            intent={gamepad === activeGamepad ? (isGamepadActive ? "danger" : "success") : "none"}
                            icon={<Icon icon="switch" />}
                            text={gamepad.id}
                            active={activeGamepad?.id === gamepad.id}
                            onClick={() => setActiveGamepadID(gamepad.id)}
                        />
                        {gamepad === activeGamepad && (
                            <GamepadDebug />
                        )}
                    </div>
                ))}

                {gamepads.length === 0 && (
                    <MenuItem icon={<Icon icon="disable" />} text="No gamepads connected" />
                )}
            </Menu>
        </div>
    );
}