// Used by `npm run test:global-setup`, intentionally without a jest preset
module.exports = async () => {
  process.env.EXODUS_TEST_GLOBAL_SETUP_RAN = '1'
}
