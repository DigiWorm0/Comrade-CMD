import { Button, Callout } from "@blueprintjs/core";
import useBT, { useConnectBTDevice, useDisconnectBTDevice } from "../../hooks/useBluetooth";


export default function BluetoothMenu() {
    const connectBTDevice = useConnectBTDevice();
    const disconnectBTDevice = useDisconnectBTDevice();
    const bt = useBT();

    return (
        <div style={{
            height: "100%",
            width: "100%",

            padding: 5,

            overflowY: "auto",
            overflowX: "hidden",
        }}>
            <h1>Bluetooth</h1>
            {bt ? (
                <>
                    <Callout
                        title="Connected"
                        intent="success"
                    >
                        <p>
                            {bt._device.name}
                        </p>
                    </Callout>
                    <Button
                        fill
                        text="Disconnect"
                        style={{
                            marginTop: 10,
                        }}
                        onClick={disconnectBTDevice}
                    />
                </>
            ) : (
                <Button
                    fill
                    icon="link"
                    text="Pair Bluetooth Device"
                    onClick={connectBTDevice}
                />
            )}
        </div>
    );
}