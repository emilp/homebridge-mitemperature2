import { InfluxConfig } from './types';
import { INFLUXDB_HOST, INFLUXDB_DATABASE, INFLUXDB_MEASUREMENT, INFLUXDB_TAG, INFLUXDB_KEY_TEMPERATURE, 
  INFLUXDB_KEY_HUMIDITY } from './settings';

export const defaultInfluxConfig: InfluxConfig = {
  host: INFLUXDB_HOST,
  database: INFLUXDB_DATABASE,
  measurement: INFLUXDB_MEASUREMENT,
  tag: INFLUXDB_TAG,
  keyTemperature: INFLUXDB_KEY_TEMPERATURE,
  keyHumidity: INFLUXDB_KEY_HUMIDITY,
};