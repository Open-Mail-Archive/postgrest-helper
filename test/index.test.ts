import {PostgrestClient} from '@supabase/postgrest-js';
import {PostgrestHelper, NoKeyInEnvError, NoUrlInEnvError} from '../src/index';

beforeEach(() => {
  console.debug = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
});

describe('PostgrestHelper::constructor', () => {
  afterEach(() => {
    (PostgrestHelper['instance'] as any) = undefined; // reset singleton
  });

  it('Should throw an error if no server url is defined in the environment', () => {
    const cache = process.env.SUPABASE_URL;
    delete process.env.SUPABASE_URL; // make sure the env var is undefined
    expect(() => {
      PostgrestHelper.client;
    }).toThrow(NoUrlInEnvError);
    process.env.SUPABASE_URL = cache;
  });

  it('Should throw an error if no server key is defined in the environment', () => {
    const cache = process.env.SUPABASE_ANON_KEY;
    delete process.env.SUPABASE_ANON_KEY; // make sure the env var is undefined
    expect(() => {
      PostgrestHelper.client;
    }).toThrow(NoKeyInEnvError);
    process.env.SUPABASE_ANON_KEY = cache;
  });

  it('Should create a StorageClient object if all env vars are present.', () => {
    expect(PostgrestHelper.client).toBeInstanceOf(PostgrestClient);
  });
});

describe('PostgrestHelper should be able to perform C.R.U.D. operations on data in tables', () => {
  it('Should be able to insert new rows in a table.', async () => {
    const response = await PostgrestHelper.client
      .from('test-table')
      .insert({data: 'test-data'});
    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();
    expect(response.body).toBeDefined();
    expect(response.status).toBe(201);
    expect(response.statusText).toBe('Created');
  });

  it('Should be able to read rows from a table.', async () => {
    const response = await PostgrestHelper.client
      .from('test-table')
      .select()
      .match({data: 'test-data'});
    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();
    expect(response.body).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });

  it('Should be able to update rows in a table.', async () => {
    const response = await PostgrestHelper.client
      .from('test-table')
      .update({data: 'updated-data'})
      .match({data: 'test-data'});
    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();
    expect(response.body).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });

  it('Should be able to delete rows from a table.', async () => {
    const response = await PostgrestHelper.client
      .from('test-table')
      .delete()
      .match({data: 'updated-data'});
    expect(response.error).toBeNull();
    expect(response.data).toBeDefined();
    expect(response.body).toBeDefined();
    expect(response.status).toBe(200);
    expect(response.statusText).toBe('OK');
  });
});
