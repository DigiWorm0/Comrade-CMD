#include <ESP32Servo.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEServer.h>

#define BT_NAME                   "ComradeBT"
#define MOTOR_SERVICE_UUID        "1e4bb5ae-307f-46cb-acdc-90558449f3f2"
#define DRIVE_CHARACTERISTIC_UUID "02d47e08-db20-4541-b8fd-fc269e38246b"
#define STEER_CHARACTERISTIC_UUID "02f58f96-4dc5-4c17-b4f9-eb9dc3c2be90"

/*
    Utils
*/
void setup() {
  logInfo("Starting up...");

  initBluetooth();
  initMotors(12, 13);

  logInfo("The device started, now you can pair it with bluetooth!");
}

void loop() {
  updateBluetooth();
}

void logInfo(String text) {
  Serial.println(text);
}

/*
    Bluetooth
*/

BLEServer *btServer;
BLEService *motorService;
BLECharacteristic *driveCharacteristic;
BLECharacteristic *steerCharacteristic;
BLEAdvertising *btAdvertising;
String inputBuffer;

void initBluetooth() {
  Serial.begin(115200);
  BLEDevice::init(BT_NAME);
  btServer = BLEDevice::createServer();
  motorService = btServer->createService(MOTOR_SERVICE_UUID);

  driveCharacteristic = motorService->createCharacteristic(
    DRIVE_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );

  steerCharacteristic = motorService->createCharacteristic(
    STEER_CHARACTERISTIC_UUID,
    BLECharacteristic::PROPERTY_READ |
    BLECharacteristic::PROPERTY_WRITE
  );

  uint8_t defaultVal = 0;
  driveCharacteristic->setValue(&defaultVal, 1);
  steerCharacteristic->setValue(&defaultVal, 1);
  motorService->start();

  btAdvertising = BLEDevice::getAdvertising();
  btAdvertising->addServiceUUID(MOTOR_SERVICE_UUID);
  btAdvertising->setScanResponse(true);
  btAdvertising->setMinPreferred(0x06);
  btAdvertising->setMinPreferred(0x12);
  BLEDevice::startAdvertising();
}

void updateBluetooth() {
  double driveVal = byteToDouble(driveCharacteristic->getData());
  double steerVal = byteToDouble(steerCharacteristic->getData());
  
  //logInfo(driveCharacteristic->getValue().c_str());

  runDriveMotor(driveVal);
  runSteerMotor(steerVal);
}

double byteToDouble(uint8_t* val) {
  double dVal = *val;
  return (dVal - 127.0) / 127.0;
}

/*
    Motors
*/
Servo driveMotor;
Servo steerMotor;
double currentDriveVal = 0;
double currentSteerVal = 0;

void initMotors(byte drivePin, byte steerPin)
{
 driveMotor.attach(drivePin);
 steerMotor.attach(steerPin);
 runDriveMotor(0);
}

void runDriveMotor(double inputVal)
{
  double val = constrain(inputVal, -1, 1);
  if (val == currentDriveVal)
    return;
  currentDriveVal = val;
  int ms = (val * 400) + 1500; // 1100 - 1500 - 1900
  driveMotor.writeMicroseconds(ms);
  logInfo("[Drive] " + String(val) + " (" + String(ms) + ")");
}

void runSteerMotor(double inputVal)
{
  double val = constrain(inputVal, -1, 1);
  if (val == currentSteerVal)
    return;
  currentSteerVal = val;
  int ms = (val * 90) + 90; // 0 - 90 - 180
  steerMotor.write(ms);
  logInfo("[Steer] " + String(val) + " (" + String(ms) + ")");
}