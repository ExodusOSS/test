// Used by `npm run test:global-setup`, intentionally without a jest preset
module.exports = async () => {
  if (process.env.EXODUS_TEST_GLOBAL_SETUP_RAN !== '1') throw new Error('globalSetup did not run')
}
