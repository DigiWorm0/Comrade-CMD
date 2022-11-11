#include <Ultrasonic.h>
#include <PS4Controller.h>

#include "Motor.h"

/*
    Utils
*/
Motor driveMotor(23, 1500, 1700); // 1500 1900
Motor steerServo(17, 90, 180);
Ultrasonic leftUltrasonic(27, 16);
Ultrasonic rightUltrasonic(13, 5);
double distance;
double steerTrim = 0;

void setup() {
  Serial.begin(115200);
  Serial.println("Starting up...");
  driveMotor.setDeadband(0.1);
  steerServo.setDeadband(0.1);
  steerServo.setLimit(0.35);
  initBluetooth();
}

void loop() {
  PS4.sendToController();
  delay(100);
}  

/*
    Bluetooth
*/
void onConnect()
{
  Serial.println("Connected!");
}

void onDisconnect()
{
  driveMotor.set(0);
  steerServo.set(0);
  Serial.println("Disconnected!");
}

void onNotify()
{
  uint8_t rightX = PS4.RStickX();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        
  uint8_t rightT = PS4.R2Value();
  uint8_t leftT = PS4.L2Value();

  double steerVal = (double)rightX / 127;
  if (steerVal > 1)
    steerVal -= 2;

  double accelVal = ((double)rightT / 255) - ((double)leftT / 255);

  PS4.setLed(255 - rightT, 255 - leftT, 0);

  steerServo.set(steerVal);
  driveMotor.set(accelVal);

  
  bool trimUp = PS4.Up();
  bool trimDown = PS4.Down();
  if (trimUp)
    steerTrim += 0.0005;
  if (trimDown)
    steerTrim -= 0.0005;
  if (trimUp || trimDown)
    steerServo.setTrim(steerTrim);
}

void initBluetooth() {
  PS4.attach(onNotify);
  PS4.attachOnConnect(onConnect);
  PS4.attachOnDisconnect(onDisconnect);
  PS4.begin();
}