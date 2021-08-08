/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable require-jsdoc */

import "reflect-metadata";
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import {container} from "tsyringe";
import * as queryString from "query-string";
import * as rm from "typed-rest-client/RestClient";

import {Logger} from "./common/logger";
import {AirPressureService} from "./service/airPressureService";

// initialize env
const lineConfig = {
  channelAccessToken: functions.config().line.channelaccesstoken, // 環境変数からアクセストークンをセットしています
  channelSecret: functions.config().line.channelsecret,
};

// initialize firestore
admin.initializeApp();
const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

// initialize weather api
const baseUrl = "https://zutool.jp/api/";
const restc: rm.RestClient = new rm.RestClient("rest-zutool", baseUrl);

// initialize DI
container.register("ILogger", {useClass: Logger});
container.register("FirestoreDb", {useValue: db});
container.register("WeatherRestClient", {useValue: restc});
container.register("LineBotConfig", {useValue: lineConfig});
const airPressureService = container.resolve(AirPressureService);

export const bot = functions.https.onRequest(async (request, response) => {
  functions.logger.info("Hello bot", {structuredData: true});
  const events = request.body.events[0];
  const userId = events.source.userId;
  const isPostBack = events?.postback;

  if (!isPostBack) {
    await handleReply(events, userId);
  } else {
    await handlePostBack(events, userId);
  }

  response.status(200).send();
});

exports.scheduledFunction = functions.pubsub
    .schedule("0 7 * * *")
    .onRun(async (context) => {
      functions.logger.info("batch start.");
      await airPressureService.pushAshNotifyToUsers();
      functions.logger.info("batch end.");
    });

async function handlePostBack(events: any, userId: any) {
  functions.logger.info("handle postback.", userId, events.postback.data);
  const data = events.postback.data;
  const parsed = queryString.parse(data);
  const action = parsed["action"];
  await airPressureService.handlePostBack(action, parsed, userId);
  functions.logger.info("end handle postback.", events.postback.data);
}

async function handleReply(events: any, userId: any) {
  functions.logger.info("handle reply.", userId);
  airPressureService.handleReply(events);
}
