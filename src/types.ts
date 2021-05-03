export type APIResponse<Result, ErrorResult = { errorCode: string }> =
  | ({ success: true } & Result)
  | ({ message: string; success: false } & ErrorResult);
export type ErrorResponse<T> = { success: false; message: string } & T;

export type ServiceStatus =
  | { success: true }
  | { message: string; success: false };

export type CheckAPIResult = {
  success: boolean;
  config: ServiceStatus;
  database: ServiceStatus;
  network: ServiceStatus;
};

export type InitError = {
  init?: CheckAPIResult;
  sendData?: ErrorResponse<{ errorCode: string }>;
};

export type PosInformation = {
  registerNo: string;
  branchNo: string;
  posId: string;
  dbDirPath: string;
  extraInfo: {
    countBill: number;
  };
};

export enum BillType {
  ToCitizen = '1',
  ToOrg = '3',
  Invoice = '5',
}

export enum TaxType {
  VAT = '1',
  NoVAT = '2',
  ZeroVAT = '3',
}

export enum BankId {
  MongolBank = '01',
  CapitalBank = '02',
  TDB = '04',
  KhaanBank = '05',
  GolomtBank = '15',
  TransBank = '19',
  ArigBank = '21',
  CreditBank = '22',
  UBCBank = '26',
  NIBank = '29',
  CapitronBank = '30',
  KhasBank = '32',
  ChingisKhaanBank = '33',
  StateBank = '34',
  DevelopmentBank = '36',
  BogdBank = '38',
}

export enum DistrictId {
  Arkhangai = '01',
  BayanUlgii = '02',
  Bayankhongor = '03',
  Bulgan = '04',
  GoviAltai = '05',
  Dornogovi = '06',
  Dornod = '07',
  Dundgovi = '08',
  Zavkhan = '09',
  Uvurkhangai = '10',
  Umnugovi = '11',
  Sukhbaatar = '12',
  Selenge = '13',
  Tuv = '14',
  Uvs = '15',
  Khovd = '16',
  Khuvsgul = '17',
  Khentii = '18',
  DarkhanUul = '19',
  Orkhon = '20',
  Govisumber = '32',
  KhaanUul = '23',
  Bayanzurkh = '24',
  SukhbaatarUB = '25',
  Bayangol = '26',
  Baganuur = '27',
  Bagakhangai = '28',
  Nalaikh = '29',
  Songinokhairkhan = '34',
  Chingeltei = '35',
}

export type Stock = {
  /**
   * Internal code of good or service
   */
  code: string;
  /**
   * Internal name of good or service
   */
  name: string;
  measureUnit: string;
  /**
   * Quantity
   * @type Numeric string with precision 2
   */
  qty: string;
  /**
   * Price of unit including all taxes
   * @type Numeric string with precision 2
   */
  unitPrice: string;
  /**
   * Total price including all taxes
   * @type Numeric string with precision 2
   */
  totalAmount: string;
  /**
   * Total amount of city tax
   * @type Numeric string with precision 2
   */
  cityTax: string;
  /**
   * Total amount of VAT
   * @type Numeric string with precision 2
   */
  vat: string;
  /**
   * Bar code of class code of good or service
   * @type Numeric string
   */
  barCode: string;
};
export type BankTransaction = {
  /**
   * Retrieval reference number
   * Number of non-cash transaction bill
   * @type Numeric string with 12 digits
   */
  rrn: string;
  /**
   * ID of payment terminal provider bank
   */
  bankId: BankId;
  /**
   * ID of payment terminal
   * @type Alphanumeric string with more than 6 characters
   */
  terminalId: string;
  /**
   * Approval code of non-cash transaction
   */
  approvalCode: string;
  /**
   * Amount of non-cash transaction
   * @type Numeric string with precision 2
   */
  amount: string;
};

export type Bill = {
  /**
   * Total amount of bill, including all taxes
   * @type Numeric string with precision 2
   */
  amount: string;
  /**
   * Total VAT amount of bill
   * @type Numeric string with precision 2
   */
  vat: string;
  /**
   * Total amount paid with cash
   * @type Numeric string with precision 2
   */
  cashAmount: string;
  /**
   * Total amount paid with non-cash
   * @type Numeric string with precision 2
   */
  nonCashAmount: string;
  /**
   * Total amount of city tax
   * @type Numeric string with precision 2
   */
  cityTax: string;
  /**
   * Code of region where bill is being printed
   * @example DistrictId.Bayangol
   */
  districtCode: DistrictId;
  /**
   * Internal code of cash register
   * @type Numeric string with 4-6 digits
   */
  posNo: string;
  /**
   * Tax number of purchasing organization or registration nubmer of citizen
   * @type Numeric string with 7 digits or citizen's registration nubmer
   */
  customerNo?: string;
  /**
   * If omitted, default value is BillType.ToCitizen
   */
  billType?: BillType;
  /**
   * Internal number of bill, used to generate unique bill ID
   *
   * Should be unique on current day
   *
   * Should be set when server sends multiple requests
   * simultaneously in order to prevent bill ID collision
   * @type Numeric string with 6 digits
   */
  billIdSuffix?: string;
  /**
   * ID of bill to be edited
   * @type Numeric string with 33 digits
   */
  returnBillId?: string;
  /**
   * If omitted, default value is TaxType.VAT
   */
  taxType?: TaxType;
  /**
   * ID of invoice corresponding to the current bill
   * @type Numeric string with 33 digits
   */
  invoiceId?: string;
  /**
   * Report month corresponding to current bill
   *
   * Should be set when BillType is ToOrg
   * @type Date string in format 'yyyy-MM'
   */
  reportMonth?: string;
  /**
   * Number of branch
   * @type Numeric string with 3 digits
   */
  branchNo: string;
  stocks: Stock[];
  bankTransactions?: BankTransaction[];
};

export type BatchBill = Omit<Bill, 'posNo'> & {
  /**
   * Internal code used to identify bill
   */
  internalId: string;
  /**
   * Tax number of organization bill is assigned
   */
  registerNo: string;
  /**
   * Internal code of cash register
   *
   * As it could change of batch bill ID or batch ID, it is not required
   * @type Numeric string with 4-6 digits
   */
  posNo?: string;
};

export type PutBillRequest = Bill;
export type BatchBillRequest = {
  group: boolean;
  /**
   * Total amount of VAT
   * @type Numeric string with precision 2
   */
  vat: string;
  /**
   * Total amount of transaction
   * @type Numeric string with precision 2
   */
  amount: string;
  billType: BillType;
  /**
   * Internal number of bill, used to generate unique bill ID
   *
   * Should be unique on current day
   *
   * Should be set when server sends multiple requests
   * simultaneously in order to prevent bill ID collision
   * @type Numeric string with 6 digits
   */
  billIdSuffix: string;
  /**
   * Internal code of cash register
   * @type Numeric string with 4-6 digits
   */
  posNo: string;
  bills: BatchBill[];
};

export type PutResponse = {
  registerNo: string;
  billId: string;
  date: string;
  macAddress: string;
  internalCode: string;
  billType: BillType;
  qrData: string;
  lottery: string;
  lotteryWarningMsg?: string;
};

export type ReturnBillRequest = {
  /**
   * ID of bill to return
   * @type Numeric string with 33 digits
   */
  returnBillId: string;
  /**
   * Bill's date of print
   * @type Date string in format 'yyyy-MM-dd hh:mm:ss'
   */
  date: string;
};

/**
 * @summary MerchantInfo is response of corresponding query. Contains information about organization.
 */
export type MerchantInfo = {
  /**
   * Date when current merchant was registered as VAT payer.
   * @type Date string in format 'yyyy-MM-dd'
   */
  registeredDate: string;
  /**
   * Date of latest receipt printed by current merchant.
   * @type Date string in format 'yyyy-MM-dd'
   */
  lastReceiptDate: string | null;
  /**
   * Name of this organization
   */
  name: string;
  /**
   * Whether if this merchant pays city tax
   */
  isCityTaxPayer: boolean;
  /**
   * Whether if this merchant pays VAT
   */
  isVATPayer: boolean;
};
