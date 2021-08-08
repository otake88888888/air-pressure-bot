/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-len */
/* eslint-disable require-jsdoc */
import {inject, singleton} from "tsyringe";
import {ILogger} from "../common/logger";
import * as rm from "typed-rest-client/RestClient";
import {Today, ZutoolWeatherStatus} from "../model/zutool";

@singleton()
export class WeatherRepository {
  constructor(
    @inject("WeatherRestClient") private weatherRestClient: rm.RestClient,
    @inject("ILogger") private logger: ILogger
  ) {}

  async getWeather() {
    const restRes: rm.IRestResponse<ZutoolWeatherStatus> = await this.weatherRestClient.get<ZutoolWeatherStatus>("getweatherstatus/13101");
    if (restRes.statusCode != 200) {
      this.logger.error(`get weather error. ${restRes}`);
      return null;
    }
    this.logger.info(restRes.statusCode, restRes.result);
    return restRes.result;
  }

  getFormatedWeather(weather: Today | undefined) {
    const weatherType = this.getWeatherType(weather?.weather);
    const pressureLevel = this.getPressureLevel(weather?.pressure_level);
    const pressure = this.getPressure(weather?.pressure);
    const formated = `${weatherType}:${pressureLevel}:${pressure}`;
    return formated;
  }

  getPressureLevel(pressureLevelType: string | undefined) {
    if (pressureLevelType === "0") {
      return "🆗";
    }
    if (pressureLevelType === "1") {
      return "🆗";
    }
    if (pressureLevelType === "2") {
      return "⤵";
    }
    if (pressureLevelType === "3") {
      return "⚠️";
    }
    if (pressureLevelType === "4") {
      return "💣";
    }

    return "reigai"; // 例外 😇
  }

  getWeatherType(weather: string | undefined) {
    switch (weather) {
      case "100":
        return "☀";
      case "200":
        return "☁";
      case "300":
        return "☔";
      default:
        return "reigai";
    }
  }

  getPressure(pressure: string | undefined) {
    return `${pressure}pha`;
  }
}
