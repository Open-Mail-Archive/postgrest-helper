import {Helper} from './lib/helper';
export {PostgrestData} from './lib/types';

/** Singleton wrapper. */
export class PostgrestHelper {
  static instance: Helper;

  constructor(schema: string = 'public') {
    if (!PostgrestHelper.instance) {
      PostgrestHelper.instance = new Helper(schema);
    }
  }

  getInstance() {
    return PostgrestHelper.instance;
  }
}
