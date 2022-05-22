import {PostgrestClient} from '@supabase/postgrest-js';
import {Logger} from '@open-mail-archive/logger';
import 'dotenv/config';
import {NoUrlInEnvError, NoKeyInEnvError} from './lib/errors';

export {NoUrlInEnvError, NoKeyInEnvError};

/**
 * Singleton wrapper for the PostgrestHelper.
 *
 * This class facilitates the instantiation of a single PostgrestClient object per package.
 *
 * Once created, the PostgrestClient is cached and any subsequent call to this class will return the
 * cached value.
 */
export class PostgrestHelper {
  private static instance: PostgrestHelper;
  private _client: PostgrestClient;

  /** Getter for the cached PostgrestClient instance. */
  public static get client() {
    return this.Instance._client;
  }

  /**
   * Get a reference to the singleton instance.
   *
   * Creates a new instance if none is defined.
   */
  private static get Instance() {
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  /**
   * Create a new Helper class instance.
   */
  private constructor() {
    this._client = this.createClient();
  }

  /**
   * Extract the server url from the env vars and generates the postgrest backend url.
   * @return {string} the server url for the postgrest backend.
   */
  private getUrl() {
    if (!process.env.SUPABASE_URL) {
      Logger.Instance.error({
        trace: 'PostgrestHelper::getUrl',
        message: 'SUPABASE_URL not found in environment!',
      });
      throw new NoUrlInEnvError();
    }

    Logger.Instance.info({
      trace: 'PostgrestHelper::getUrl',
      message: 'Extracting server URL from env.',
    });
    const envUrl = process.env.SUPABASE_URL.replace(/\/$/, '') + '/rest/v1';
    Logger.Instance.debug({
      trace: 'PostgrestHelper::getUrl',
      message: 'URL extracted.',
      data: envUrl,
    });

    return envUrl;
  }

  /**
   * Extract the postgrest backend access key from the env vars.
   * @return {string} the access key for the postgrest backend
   */
  private getKey() {
    if (!process.env.SUPABASE_ANON_KEY) {
      Logger.Instance.error({
        trace: 'PostgrestHelper::getKey',
        message: 'SUPABASE_ANON_KEY not found in environment!',
      });
      throw new NoKeyInEnvError();
    }

    Logger.Instance.info({
      trace: 'PostgrestHelper::getKey',
      message: 'Extracting key from env.',
    });
    const envKey = process.env.SUPABASE_ANON_KEY;
    Logger.Instance.debug({
      trace: 'PostgrestHelper::getKey',
      message: 'Key extracted.',
      data: Logger.Instance.obfuscate(envKey),
    });

    return envKey;
  }

  /**
   * Build the params dictionary required for the client object creation.
   * @return {{apikey: string, Authorization: string }} the params dictionary
   */
  private getParams() {
    Logger.Instance.info({
      trace: 'PostgrestHelper::getParams',
      message: 'Building params dictionary..',
    });
    const key = this.getKey();
    const params = {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      schema: 'public',
    };
    Logger.Instance.debug({
      trace: 'PostgrestHelper::getParams',
      message: 'Params formatted.',
      data: {
        headers: {
          apikey: Logger.Instance.obfuscate(params.headers.apikey),
          Authorization: Logger.Instance.obfuscate(
            params.headers.Authorization,
            12,
          ),
        },
        schema: params.schema,
      },
    });

    return params;
  }

  /**
   * Create a new Postgrest Client.
   * @return {PostgrestClient} the postgrest client.
   */
  private createClient(): PostgrestClient {
    Logger.Instance.info({
      trace: 'PostgrestClient::createClient',
      message: 'Creating a new client.',
    });
    const client = new PostgrestClient(this.getUrl(), this.getParams());
    Logger.Instance.debug({
      trace: 'PostgrestClient::createClient',
      message: 'Client created.',
      data: client,
    });

    return client;
  }
}
