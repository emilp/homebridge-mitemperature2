import { API, DynamicPlatformPlugin, Logger, PlatformAccessory, PlatformConfig, Service, Characteristic } from 'homebridge';
import { InfluxDB } from 'influx';

import { PLATFORM_NAME, PLUGIN_NAME } from './settings';
import { InfluxConfigInterface } from './types';
import { InfluxDBTemperatureHumidityAccessory } from './platformAccessory';
import { defaultInfluxConfig } from './config';

/**
 * HomebridgePlatform
 * This class is the main constructor for your plugin, this is where you should
 * parse the user config and discover/register accessories with Homebridge.
 */
export class InfluxDBTemperatureHumidityPlatform implements DynamicPlatformPlugin {
  public readonly Service: typeof Service = this.api.hap.Service;
  public readonly Characteristic: typeof Characteristic = this.api.hap.Characteristic;

  // this is used to track restored cached accessories
  public readonly accessories: PlatformAccessory[] = [];

  // this is InfluxDB configuration
  public readonly influxConfig!: InfluxConfigInterface;

  constructor(
    public readonly log: Logger,
    public readonly config: PlatformConfig,
    public readonly api: API,
  ) {

    // We can't start without being configured.
    if(!config) {
      return;
    }

    this.influxConfig = 'influx' in config ? config.influx as InfluxConfigInterface : defaultInfluxConfig;
    this.influxConfig.host = 'host' in this.influxConfig ? this.influxConfig.host : defaultInfluxConfig.host;
    this.influxConfig.database = 'database' in this.influxConfig ? this.influxConfig.database : defaultInfluxConfig.database;
    this.influxConfig.measurement = 'measurement' in this.influxConfig ? this.influxConfig.measurement : defaultInfluxConfig.measurement;
    this.influxConfig.tag = 'tag' in this.influxConfig ? this.influxConfig.tag : defaultInfluxConfig.tag;
    this.influxConfig.keyTemperature = 'keyTemperature' in this.influxConfig ? 
      this.influxConfig.keyTemperature : defaultInfluxConfig.keyTemperature;
    this.influxConfig.keyHumidity = 'keyHumidity' in this.influxConfig ? this.influxConfig.keyHumidity : defaultInfluxConfig.keyHumidity;
    
    this.log.debug('Finished initializing platform:', this.config.name);

    // When this event is fired it means Homebridge has restored all cached accessories from disk.
    // Dynamic Platform plugins should only register new accessories after this event was fired,
    // in order to ensure they weren't added to homebridge already. This event can also be used
    // to start discovery of new accessories.
    this.api.on('didFinishLaunching', () => {
      log.debug('Executed didFinishLaunching callback');
      // run the method to discover / register your devices as accessories
      this.discoverDevices();
    });
  }

  /**
   * This function is invoked when homebridge restores cached accessories from disk at startup.
   * It should be used to setup event handlers for characteristics and update respective values.
   */
  configureAccessory(accessory: PlatformAccessory) {
    this.log.info('Loading accessory from cache:', accessory.displayName);

    // add the restored accessory to the accessories cache so we can track if it has already been registered
    this.accessories.push(accessory);
  }

  /**
   * This is an example method showing how to register discovered accessories.
   * Accessories must only be registered once, previously created accessories
   * must not be registered again to prevent "duplicate UUID" errors.
   */
  discoverDevices() {

    const influx = new InfluxDB({
      host: this.influxConfig.host,
      database: this.influxConfig.database,
    });
    influx.queryRaw(`show tag values with key = ${this.influxConfig.tag}`).then(rawData => {
      rawData.results[0].series[0].values.forEach(element => {
        const sensorName = element[1];
        const uuid = this.api.hap.uuid.generate(sensorName);
        this.log.debug(sensorName + ' ' + uuid);

        // see if an accessory with the same uuid has already been registered and restored from
        // the cached devices we stored in the `configureAccessory` method above
        const existingAccessory = this.accessories.find(accessory => accessory.UUID === uuid);

        if (existingAccessory) {
          // the accessory already exists
          this.log.info('Restoring existing accessory from cache:', existingAccessory.displayName);
  
          // if you need to update the accessory.context then you should run `api.updatePlatformAccessories`. eg.:
          // existingAccessory.context.device = device;
          // this.api.updatePlatformAccessories([existingAccessory]);
  
          // create the accessory handler for the restored accessory
          // this is imported from `platformAccessory.ts`
          new InfluxDBTemperatureHumidityAccessory(this, existingAccessory);
  
          // it is possible to remove platform accessories at any time using `api.unregisterPlatformAccessories`, eg.:
          // remove platform accessories when no longer present
          // this.api.unregisterPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [existingAccessory]);
          // this.log.info('Removing existing accessory from cache:', existingAccessory.displayName);
        } else {
          // the accessory does not yet exist, so we need to create it
          this.log.info('Adding new accessory:', sensorName);
  
          // create a new accessory
          const accessory = new this.api.platformAccessory(sensorName, uuid);
  
          // store a copy of the device object in the `accessory.context`
          // the `context` property can be used to store any data about the accessory you may need
          //accessory.context.device = device;
  
          // create the accessory handler for the newly create accessory
          // this is imported from `platformAccessory.ts`
          new InfluxDBTemperatureHumidityAccessory(this, accessory);
  
          // link the accessory to your platform
          this.api.registerPlatformAccessories(PLUGIN_NAME, PLATFORM_NAME, [accessory]);
        }
      });
    });
    
  }
}
