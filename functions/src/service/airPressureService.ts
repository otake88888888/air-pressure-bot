/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */

import {inject, injectable} from "tsyringe";
import * as queryString from "query-string";
import {ILogger} from "../common/logger";
import {LineRepository} from "../repository/lineRepository";
import {WeatherRepository} from "../repository/weatherRepository";

@injectable()
export class AirPressureService {
  constructor(
    private weatherRepository: WeatherRepository,
    private lineRepository: LineRepository,
    @inject("ILogger") private logger: ILogger
  ) {}

  async getAirPressure() {
    const weather = await this.weatherRepository.getWeather();
    this.logger.debug("get weather. place name is " + weather?.place_name);
    return weather;
  }

  async replyMessage(replyTextString: string, events: any): Promise<void> {
    const replyToken = events.replyToken;
    await this.lineRepository.replyMessage(replyToken, replyTextString);
  }

  async handleReply(events: any) {
    const weather = await this.getAirPressure();
    const todayWeather = weather?.today;
    const amSevenWeather = todayWeather?.find((x) => x.time === "7");
    const formated = this.weatherRepository.getFormatedWeather(amSevenWeather);
    await this.replyMessage(formated, events);
  }

  async handlePostBack(
      action: string | string[] | null,
      parsed: queryString.ParsedQuery<string>,
      userId: any
  ) {
    this.logger.info(action);
    this.logger.info(parsed);
    this.logger.info(userId);
  }

  async pushAshNotifyToUsers() {
    this.logger.info("");
  }
}
