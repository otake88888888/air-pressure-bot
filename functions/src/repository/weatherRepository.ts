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
      return "π";
    }
    if (pressureLevelType === "1") {
      return "π";
    }
    if (pressureLevelType === "2") {
      return "β€΅";
    }
    if (pressureLevelType === "3") {
      return "β οΈ";
    }
    if (pressureLevelType === "4") {
      return "π£";
    }

    return "reigai"; // δΎε€ π
  }

  getWeatherType(weather: string | undefined) {
    switch (weather) {
      case "100":
        return "β";
      case "200":
        return "β";
      case "300":
        return "β";
      default:
        return "reigai";
    }
  }

  getPressure(pressure: string | undefined) {
    return `${pressure}pha`;
  }
}
