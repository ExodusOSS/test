test('slow but healthy', async () => {
  await new Promise((resolve) => setTimeout(resolve, 700))
})
