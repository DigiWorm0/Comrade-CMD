import BluetoothMenu from "../components/bt/BluetoothMenu";
import GamepadMenu from "../components/gamepad/GamepadMenu";

export default function SidePanel() {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',

            height: '100vh',
            width: 450,
            padding: 20,

            overflowX: 'hidden',

            backgroundColor: '#2F343C',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.75)',
        }}>

            <GamepadMenu />
            <BluetoothMenu />

        </div>
    );
}