export default interface BTConnection {
    _device: BluetoothDevice;
    _server: BluetoothRemoteGATTServer;
    _service: BluetoothRemoteGATTService;

    drive: BluetoothRemoteGATTCharacteristic;
    steer: BluetoothRemoteGATTCharacteristic;
}