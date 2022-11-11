#include "Motor.h"

Motor::Motor(byte pin, int idleValue, int maxValue) {
  _motor.attach(pin);
  _range = maxValue - idleValue;
  _offset = idleValue;
  setRaw(idleValue);
}

void Motor::set(double value) {
  double val = constrain(value, -1, 1) * (1 - _limitVal) + _trimVal;
  if (abs(val) < _deadbandVal)
    val = 0;
  if (val == _currentVal)
    return;
  _currentVal = val;
  int ms = (val * _range) + _offset; // 0 - 90 - 180
  setRaw(ms);
  Serial.println(_logPrefix + String(val) + " (" + String(ms) + ")");
}

void Motor::setName(String name)
{
  _logPrefix = "[" + name + "] ";
}

void Motor::setRaw(int value) {
  _motor.write(value);
}

void Motor::setDeadband(double deadband) {
  _deadbandVal = deadband;
}

void Motor::setLimit(double limit) {
  _limitVal = limit;
}

void Motor::setTrim(double trim) {
  _trimVal = trim;
}