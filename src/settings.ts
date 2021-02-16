/**
 * This is the name of the platform that users will use to register the plugin in the Homebridge config.json
 */
export const PLATFORM_NAME = 'InfluxDBTemperatureHumidity';

/**
 * This must match the name of your plugin as defined the package.json
 */
export const PLUGIN_NAME = 'homebridge-mitemperature2';

/**
 * This is the hostname (or IP address) of the InfluxDB server
 */
export const INFLUXDB_HOST = '127.0.0.1';

/**
 * This is the name of the database that stores measurements of the sensors
 */
export const INFLUXDB_DATABASE = 'mydb';

/**
 * This is the name of the measurements table
 */
export const INFLUXDB_MEASUREMENT = 'tempMeasurement';

/**
 * This is the tag key used to distinguish between different sensors
 */
export const INFLUXDB_TAG = 'Sensorname';

/**
 * This is the field key for temperature
 */
export const INFLUXDB_KEY_TEMPERATURE = 'temperature';

/**
 * This is the field key for humidity
 */
export const INFLUXDB_KEY_HUMIDITY = 'humidity';