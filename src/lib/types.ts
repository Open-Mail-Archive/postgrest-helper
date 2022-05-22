export class ConnectionParams {
  headers: {
    apikey: string;
    Authorization: string;
  };

  schema: string;

  constructor(key: string, schema: string) {
    this.headers = {
      apikey: key,
      Authorization: `Bearer ${key}`,
    };
    this.schema = schema;
  }
}

export interface PostgrestData<T> {
  error: {
    message: string;
    code: string;
    details: string;
    hint: string;
  } | null;
  data: T[] | null;
  count: number | null;
  status: number;
  statusText: string;
  body: T[] | null;
}
