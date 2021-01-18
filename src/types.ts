export type APIResponse<Result, ErrorResult = Result> =
  | ({ success: true } & Result)
  | ({ message: string; success: false } & ErrorResult);

export type ServiceStatus =
  | { success: true }
  | { message: string; success: false };

export type CheckAPIResult = {
  config: ServiceStatus;
  database: ServiceStatus;
  network: ServiceStatus;
};

export type SendDataResponse = APIResponse<
  Record<string, never>,
  { errorCode: number }
>;
