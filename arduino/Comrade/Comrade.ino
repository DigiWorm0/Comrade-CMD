#include <Ultrasonic.h>
#include <PS4Controller.h>

#include "Motor.h"

/*
    Utils
*/
Motor driveMotor(23, 1500, 1900);
Motor steerServo(14, 90, 180);
Ultrasonic leftUltrasonic(27, 16);
Ultrasonic rightUltrasonic(13, 5);
double distance;


void setup() {
  Serial.begin(115200);
  Serial.println("Starting up...");
  initBluetooth();
}

void loop() {}

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

  steerServo.set(steerVal);
  driveMotor.set(accelVal);
}

void initBluetooth() {
  PS4.attach(onNotify);
  PS4.attachOnConnect(onConnect);
  PS4.attachOnDisconnect(onDisconnect);
  PS4.begin();
}