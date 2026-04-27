export default {
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3030',
    headless: true,
  },
  reporter: [['list']],
}
