import fetch from 'node-fetch';

import {
  InitError,
  CheckAPIResult,
  PosInformation,
  APIResponse,
  PutResponse,
  SendDataResponse,
  PutBillRequest,
  BatchBillRequest,
  ReturnBillRequest,
} from './types';

export class EbarimtClient {
  constructor(private url: string) {}

  async init(): Promise<
    ({ success: true } & CheckAPIResult) | { success: false; error: InitError }
  > {
    const initialStatus: CheckAPIResult = await fetch(
      `${this.url}/checkApi`,
    ).then((res) => res.json());

    if (initialStatus.success === false) {
      const shouldSendData =
        !initialStatus.config.success &&
        initialStatus.config.message.startsWith('[100]');
      if (!shouldSendData) {
        return { success: false, error: { init: initialStatus } };
      }
      const sendDataResult = await this.sendData();
      if (!sendDataResult.success) {
        return { success: false, error: { sendData: sendDataResult } };
      }
    }

    const checkApiResult = await fetch(`${this.url}/checkApi`).then(
      (res) => res.json() as Promise<CheckAPIResult>,
    );
    return { ...checkApiResult, success: true };
  }

  getInformation(): Promise<PosInformation> {
    return fetch(`${this.url}/getInformation`).then((res) => res.json());
  }

  put(bill: PutBillRequest | BatchBillRequest): Promise<PutResponse> {
    return fetch(`${this.url}/put`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: bill }),
    }).then((res) => res.json());
  }

  returnBill(
    data: ReturnBillRequest,
  ): Promise<APIResponse<Record<string, never>, { errorCode: number }>> {
    return fetch(`${this.url}/returnBill`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }).then((res) => res.json());
  }

  sendData(): Promise<APIResponse<SendDataResponse>> {
    return fetch(`${this.url}/sendData`).then((res) => res.json());
  }
}
