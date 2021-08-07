/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */

import { inject, injectable } from "tsyringe";
import { ILogger } from "../common/logger";
import { WeatherRepository } from "../repository/weatherRepository";

@injectable()
export class AirPressureService {
constructor(
    private weatherRepository: WeatherRepository,
    @inject("ILogger") private logger: ILogger) {
  }

  async getAirPressure(){
    let weather = await this.weatherRepository.getWeather();
    this.logger.debug("get weather. place name is " + weather?.place_name);
    return weather;
  }
}