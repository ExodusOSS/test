// Run with `npm run test:global-setup`
test('jest globalSetup without a preset ran before tests', () => {
  expect(process.env.EXODUS_TEST_GLOBAL_SETUP_RAN).toBe('1')
})
