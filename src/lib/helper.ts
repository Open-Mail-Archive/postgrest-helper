import {PostgrestClient} from '@supabase/postgrest-js';
import * as Logger from '@pyle_of_mail/logger';
import 'dotenv/config';

import {ConnectionParams} from './types';

/** Actual helper class implementation. */
export class Helper {
  #url: string;
  #key: string;
  #schema: string;
  #params: ConnectionParams;
  #client: PostgrestClient;

  constructor(schema: string = 'public') {
    Logger.assertInEnv('SUPABASE_URL');
    Logger.assertInEnv('SUPABASE_ANON_KEY');

    this.#schema = schema;
    this.#url = this.#getUrl();
    this.#key = this.#getKey();
    this.#params = this.#getParams();
    this.#client = this.getClient();
  }

  /** Extract the server url from the env vars and append the PostgREST endpoint. */
  #getUrl(): string {
    Logger.info('[PostgREST] Extracting server url from environment.');
    const envUrl =
      process.env.SUPABASE_URL?.replace(/\/$/, '') + '/rest/v1' ?? '';
    Logger.debug(envUrl);

    return envUrl;
  }

  /** Extract the server key from the env vars. */
  #getKey(): string {
    Logger.info('[PostgREST] Extracting server key from environment.');
    const envKey = process.env.SUPABASE_ANON_KEY ?? '';
    Logger.debug(envKey);

    return envKey;
  }

  /** Build the params dictionary required for the client object creation. */
  #getParams(): ConnectionParams {
    Logger.info('[PostgREST] Building params dictionary.');
    const params = new ConnectionParams(this.#key, this.#schema);
    Logger.debug(params);

    return params;
  }

  /** Create a new PostgrestClient. */
  getClient(): PostgrestClient {
    Logger.info('[PostgREST] Creating a new client.');
    const client = new PostgrestClient(this.#url, this.#params);
    Logger.debug(client);

    return client;
  }

  /** Getter for the private client member, so that it is read-only. */
  get client(): PostgrestClient {
    return this.#client;
  }
}
