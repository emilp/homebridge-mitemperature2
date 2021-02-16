// Influx configuration options
export interface InfluxConfigInterface {
    host: string;
    database: string;
    measurement: string;
    tag: string;
    keyTemperature: string;
    keyHumidity: string;
}

export type InfluxConfig = Readonly<InfluxConfigInterface>;