#ifndef Motor_h
#define Motor_h
#include <Arduino.h>
#include <ESP32Servo.h>

class Motor {
  private:
    Servo _motor;
    String _logPrefix = "[Motor] ";
    int _range = 0;
    int _offset = 0;
    double _currentVal = 0;
    double _deadbandVal = 0;
    double _limitVal = 0;
    double _trimVal = 0;

  public:
    /**
      Defines a PWM-controlled motor on an ESP32
      @param pin - PWM pin #
      @param idleValue - PWM to output on idle
      @param maxValue - Maximum PWM to output
    */
    Motor(byte pin, int idleValue, int maxValue);

    /** 
      Sets the input speed into the motor
      @param value - Motor speed between -1 - 0 - 1
    */
    void set(double value);

    /** 
      Sets the input PWM into the motor
      @param value - Size of PWM signal in milliseconds
    */
    void setRaw(int value);

    /**
      Sets the log names of the motor
      @param name - Display name to log the motor as
    */
    void setName(String name);

    /**
      Sets the motor's deadband range
      @param deadband - Value from 0 - 1
    */
    void setDeadband(double deadband);

    /**
      Sets the motor's limit value
      @param limit - Value from 0 - 1
    */
    void setLimit(double limit);

    /**
      Sets the motor's trim value
      @param trim - Value from 0 - 1
    */
    void setTrim(double trim);
};

#endif