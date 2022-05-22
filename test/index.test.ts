const PostgrestJS = require('@supabase/postgrest-js');
const PostgrestHelper = require('../src/index');

test('Create helper', async () => {
  const helper = new PostgrestHelper.PostgrestHelper().getInstance();

  expect(helper.client).toBeInstanceOf(PostgrestJS.PostgrestClient);
});
