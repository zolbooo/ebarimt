import fetch from 'node-fetch';

import {
  InitError,
  CheckAPIResult,
  PosInformation,
  APIResponse,
  PutResponse,
  PutBillRequest,
  BatchBillRequest,
  ReturnBillRequest,
  MerchantInfo,
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

  async put(
    bill: PutBillRequest | BatchBillRequest,
  ): Promise<APIResponse<PutResponse>> {
    const response: APIResponse<PutResponse> = await fetch(`${this.url}/put`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: bill }),
    }).then((res) => res.json());

    if (response.success && response.lotteryWarningMsg) {
      const sendDataResponse = await this.sendData();
      if (!sendDataResponse.success) {
        console.warn(
          `[${sendDataResponse.errorCode}] ${sendDataResponse.message}`,
        );
      }
    }

    return response;
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

  sendData(): Promise<
    APIResponse<Record<string, never>, { errorCode: string }>
  > {
    return fetch(`${this.url}/sendData`).then((res) => res.json());
  }

  /**
   * Convert citizen register number to numeric string
   * @param regNo Citizen's reg number
   * @returns Converted reg number converted to the numeric value
   */
  convertCitizenRegNo(regNo: string): Promise<string> {
    return fetch(`${this.url}/callFunction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ functionName: 'toReg', data: regNo }),
    }).then((res) => res.json());
  }

  static async getOrganizationInfo(
    regNo: string,
  ): Promise<MerchantInfo | null> {
    const response: {
      vatpayerRegisteredDate: string;
      lastReceiptDate: string | null;
      receiptFound: boolean;
      name: string;
      found: boolean;
      citypayer: boolean;
      vatpayer: boolean;
    } = await fetch(
      `http://info.ebarimt.mn/rest/merchant/info?regno=${regNo}`,
    ).then((res) => res.json());
    if (!('found' in response) || !response.found) {
      return null;
    }
    return {
      name: response.name,
      isVATPayer: response.vatpayer,
      isCityTaxPayer: response.citypayer,
      registeredDate: response.vatpayerRegisteredDate,
      lastReceiptDate: response.lastReceiptDate,
    };
  }
}
