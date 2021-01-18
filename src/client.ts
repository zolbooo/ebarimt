import fetch from 'node-fetch';

import { APIResponse, CheckAPIResult, SendDataResponse } from './types';

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
}
