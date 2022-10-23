import { Menu, MenuItem } from "@blueprintjs/core";
import useGamepadState from "../../hooks/useGamepadState";

export default function GamepadDebug() {
    const gamepadState = useGamepadState();

    return (
        <Menu>
            <MenuItem
                text="Axes"
                disabled
                labelElement={(
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}>
                        {gamepadState?.axes.map((axis, index) => (
                            <div key={index}>
                                {axis.toFixed(2)} : {index}
                            </div>
                        ))}
                    </div>
                )}
            />
            <MenuItem
                text="Buttons"
                disabled
                labelElement={(
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                    }}>
                        {gamepadState?.buttons.map((button, index) => (
                            <div key={index}>
                                {button.pressed ? "Pressed" : "Not Pressed"} : {index}
                            </div>
                        ))}
                    </div>
                )}
            />
        </Menu>
    );
}