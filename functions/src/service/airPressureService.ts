/* eslint-disable @typescript-eslint/no-explicit-any */

import {inject, injectable} from "tsyringe";
import * as queryString from "query-string";
import {ILogger} from "../common/logger";
import {LineRepository} from "../repository/lineRepository";
import {WeatherRepository} from "../repository/weatherRepository";
import {FireStoreRepository} from "../repository/fireStoreRepository";

@injectable()
export class AirPressureService {
  constructor(
    private weatherRepository: WeatherRepository,
    private lineRepository: LineRepository,
    private fireStoreRepository: FireStoreRepository,
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
    const formated = await this.getFormatedWeatherMessage();
    await this.replyMessage(formated, events);
  }

  private async getFormatedWeatherMessage() {
    const weather = await this.getAirPressure();
    const todayWeather = weather?.today;
    const amSevenWeather = todayWeather?.find((x) => x.time === "7");
    const formated = this.weatherRepository.getFormatedWeather(amSevenWeather);
    return formated;
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
    const message = await this.getFormatedWeatherMessage();

    const userRef = this.fireStoreRepository.db.collection("users");
    const snapshot = await userRef.get();
    snapshot.forEach(async (doc) => {
      console.log(doc.id, "=>", doc.data());
      const userId = doc.id;
      this.lineRepository.pushMessage(userId, message);
    });
  }

  async getUser(userId: string) {
    const userDoc = this.fireStoreRepository.getUser(userId);
    return userDoc;
  }

  async createUser(userId: string) {
    await this.fireStoreRepository.createUser(userId);
  }
}
