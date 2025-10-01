// Configuration file for the Telegram Bot
// You can set these values directly or use environment variables

module.exports = {
  // Telegram Bot Token - Get this from @BotFather on Telegram
  BOT_TOKEN: process.env.BOT_TOKEN || '8240136290:AAGhBnpptmAnCvDuLwq6qEXreaeSoBJjaVM',
  
  // Google Sheets IDs - Get these from your Google Sheets URLs
  SPREADSHEET_ID_A: process.env.SPREADSHEET_ID_A || '1RA7RO9GG66inNgujXFDXkhgtmOQia5TT9AkE6W-Ad8g',
  SPREADSHEET_ID_B: process.env.SPREADSHEET_ID_B || '1r4dnwlaTIv5iyESvu43wY7WaXeKqHW-2OSPv2yahiw8', 
  SPREADSHEET_ID_C: process.env.SPREADSHEET_ID_C || '1tDjDWzLe2dpa2LPHUoNd1WvyqatoFRj52yBoBy3WV7o',
  
  // Google Sheets API Credentials path
  GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json'
};