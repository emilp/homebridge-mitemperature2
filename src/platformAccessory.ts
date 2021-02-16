import { Service, PlatformAccessory, CharacteristicGetCallback } from 'homebridge';
import { InfluxDB } from 'influx';

import { InfluxDBTemperatureHumidityPlatform } from './platform';

/**
 * Platform Accessory
 * An instance of this class is created for each accessory your platform registers
 * Each accessory may expose multiple services of different service types.
 */
export class InfluxDBTemperatureHumidityAccessory {
  private temperatureService: Service;
  private humidityService: Service;

  constructor(
    private readonly platform: InfluxDBTemperatureHumidityPlatform,
    private readonly accessory: PlatformAccessory,
  ) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Default-Manufacturer')
      .setCharacteristic(this.platform.Characteristic.Model, 'Default-Model')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'Default-Serial');


    this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor) || 
      this.accessory.addService(this.platform.Service.TemperatureSensor);
    this.temperatureService.setCharacteristic(this.platform.Characteristic.Name, 'Temperature');
    this.temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .on('get', this.getCurrentTemperature.bind(this));


    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor) || 
      this.accessory.addService(this.platform.Service.HumiditySensor);
    this.humidityService.setCharacteristic(this.platform.Characteristic.Name, 'Humidity');
    this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .on('get', this.getCurrentRelativeHumidity.bind(this));

  }

  getLastMeasurement(service: string, callback: CharacteristicGetCallback) {

    const influx = new InfluxDB({
      host: this.platform.influxConfig.host,
      database: this.platform.influxConfig.database,
    });
    
    const query = `select last(${service}) from ${this.platform.influxConfig.measurement} `
      + `where ${this.platform.influxConfig.tag}='${this.accessory.displayName}'`;
    this.platform.log.debug(query);
    influx.queryRaw(query)
      .then(rawData => callback(null, rawData.results[0].series[0].values[0][1]))
      .catch(err => callback(err));

  }

  getCurrentTemperature(callback: CharacteristicGetCallback) {
    this.getLastMeasurement(this.platform.influxConfig.keyTemperature, callback);
  }

  getCurrentRelativeHumidity(callback: CharacteristicGetCallback) {
    this.getLastMeasurement(this.platform.influxConfig.keyHumidity, callback);    
  }

}
