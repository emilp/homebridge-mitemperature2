
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# Temperature & Humidity from InfluxDB

This is a Homebridge plugin that fetches tempeature and humidity measurements from InfluxDB and exposes them as HomeKit accessories.

## Setup

This plugin can be configured using [Homebridge Config UI X](https://github.com/oznu/homebridge-config-ui-x).

It is assumed that measurements from one or multiple sensors are collected in a single InfluxDB table. For example, readings from Xiaomi Mijia LYWSD03MMC Bluetooth 4.2 Temperature Humidity sensors may be read by [MiTemperature2](https://github.com/JsBergbau/MiTemperature2) scripts and send via Node-RED to the InfluxDB. This plugins then publishes these accessories in HomeKit.

### Manual setup

```json
"platforms": [{
    "platform": "InfluxDBTemperatureHumidity",
    "influx": {
        "host": "127.0.0.1",
        "database": "mydb",
        "measurement": "tempMeasurement",
        "tag": "Sensorname",
        "keyTemperature": "temperature",
        "keyHumidity": "humidity"
    },            
}]
```

## Setup Development Environment

To develop this plugin you must have Node.js 12 or later installed, and a modern code editor such as [VS Code](https://code.visualstudio.com/). This plugin template uses [TypeScript](https://www.typescriptlang.org/) to make development easier and comes with pre-configured settings for [VS Code](https://code.visualstudio.com/) and ESLint. If you are using VS Code install these extensions:

* [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Install Development Dependencies

Using a terminal, navigate to the project folder and run this command to install the development dependencies:

```
npm install
```

## Build Plugin

TypeScript needs to be compiled into JavaScript before it can run. The following command will compile the contents of your [`src`](./src) directory and put the resulting code into the `dist` folder.

```
npm run build
```

## Link To Homebridge

Run this command so your global install of Homebridge can discover the plugin in your development environment:

```
npm link
```

You can now start Homebridge, use the `-D` flag so you can see debug log messages in your plugin:

```
homebridge -D
```

## Watch For Changes and Build Automatically

If you want to have your code compile automatically as you make changes, and restart Homebridge automatically between changes you can run:

```
npm run watch
```

This will launch an instance of Homebridge in debug mode which will restart every time you make a change to the source code. It will load the config stored in the default location under `~/.homebridge`. You may need to stop other running instances of Homebridge while using this command to prevent conflicts. You can adjust the Homebridge startup command in the [`nodemon.json`](./nodemon.json) file.

