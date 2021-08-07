import { inject, singleton } from "tsyringe";
import { ILogger } from "../common/logger";
import * as rm from 'typed-rest-client/RestClient';
import { ZutoolWeatherStatus } from "../model/zutool";

@singleton()
export class WeatherRepository {
  constructor(
    @inject("WeatherRestClient") private weatherRestClient: rm.RestClient,
    @inject("ILogger") private logger: ILogger) {
  }

  async getWeather(){
    let restRes: rm.IRestResponse<ZutoolWeatherStatus> = await this.weatherRestClient.get<ZutoolWeatherStatus>('getweatherstatus/13101');
    if(restRes.statusCode != 200){
      this.logger.error(`get weather error. ${restRes}`)
      return null;
    }
    this.logger.info(restRes.statusCode, restRes.result);
    return restRes.result;
  }
}