import fetch from 'node-fetch';

import {
  CheckAPIResult,
  PosInformation,
  APIResponse,
  PutResponse,
  SendDataResponse,
  PutBillRequest,
  BatchBillRequest,
} from './types';

export class EbarimtClient {
  constructor(private url: string) {}

  async init(): Promise<APIResponse<CheckAPIResult, { errorCode?: number }>> {
    const initialStatus: APIResponse<CheckAPIResult> = await fetch(
      `${this.url}/checkApi`,
    ).then((res) => res.json());

    if (!initialStatus.success) {
      return initialStatus;
    }

    if (
      !initialStatus.config.success &&
      initialStatus.config.message.startsWith('[100]')
    ) {
      const sendDataResult: SendDataResponse = await fetch(
        `${this.url}/sendData`,
      ).then((res) => res.json());

      if (!sendDataResult.success) {
        return sendDataResult;
      }
    }

    return fetch(`${this.url}/checkApi`).then((res) => res.json()) as Promise<
      APIResponse<CheckAPIResult>
    >;
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
}
