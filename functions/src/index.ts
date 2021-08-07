/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable require-jsdoc */

import "reflect-metadata";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { container } from "tsyringe";
import * as rm from 'typed-rest-client/RestClient';

import { Logger } from "./common/logger";
import { AirPressureService } from "./service/airPressureService";

// initialize env
const lineConfig = {
    channelAccessToken: functions.config().line.channelaccesstoken, // 環境変数からアクセストークンをセットしています
    channelSecret: functions.config().line.channelsecret,
  };

// initialize firestore
admin.initializeApp();
const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true })

// initialize weather api
let baseUrl: string = 'https://zutool.jp/api/';
let restc: rm.RestClient = new rm.RestClient('rest-zutool', baseUrl);

// initialize DI
container.register("ILogger", { useClass: Logger });
container.register("FirestoreDb", { useValue: db });
container.register("WeatherRestClient", { useValue: restc });
container.register("LineBotConfig", { useValue: lineConfig });
const airPressureService = container.resolve(AirPressureService);

export const bot = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  let weather = await airPressureService.getAirPressure();
  response.send("get weather." + weather?.dateTime);
});
