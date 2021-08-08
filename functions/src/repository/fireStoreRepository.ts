/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable require-jsdoc */
import * as firestore from "@google-cloud/firestore";
import {inject, singleton} from "tsyringe";
import {ILogger} from "../common/logger";
import * as admin from "firebase-admin";

@singleton()
export class FireStoreRepository {
  constructor(
    @inject("FirestoreDb") public db: firestore.Firestore,
    @inject("ILogger") private logger: ILogger
  ) {}

  async getUser(userId: string) {
    const userRef = this.db.collection("users").doc(userId);
    const userDoc = await userRef
        .get()
        .then((doc) => doc)
        .catch((err) => {
          throw new Error(err);
        });
    return userDoc;
  }

  async createUser(userId: string) {
    this.logger.info(`create user. ${userId}`);
    const userRef = this.db.collection("users").doc(userId);
    const userDoc = await userRef
        .get()
        .then((doc) => doc)
        .catch((err) => {
          throw new Error(err);
        });
    if (!userDoc.exists) {
      await userRef.create({});
    }
  }

  async updateUser(
      userId: any,
      dayIndex: number,
      ashType: string,
      fortnightly: number
  ): Promise<void> {
    const userRef = this.db.collection("users").doc(userId);
    await userRef.update({
      ashDays: admin.firestore.FieldValue.arrayUnion({
        dayIndex: dayIndex,
        ashType: ashType,
        fortnightly: fortnightly,
      }),
    });
  }
}
