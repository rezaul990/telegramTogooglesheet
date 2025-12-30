const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🤖 Telegram Excel to Google Sheets Bot Setup');
console.log('==========================================\n');

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setup() {
  try {
    console.log('Please provide the following information:\n');
    
    // Get Telegram Bot Token
    const botToken = await askQuestion('1. Enter your Telegram Bot Token (from @BotFather): ');
    
    // Get Google Sheets IDs
    const spreadsheetA = await askQuestion('2. Enter Spreadsheet ID for file1.xlsx: ');
    const spreadsheetB = await askQuestion('3. Enter Spreadsheet ID for file2.xlsx: ');
    const spreadsheetC = await askQuestion('4. Enter Spreadsheet ID for file3.xlsx: ');
    const spreadsheetD = await askQuestion('5. Enter Spreadsheet ID for file4.xlsx: ');
    const spreadsheetE = await askQuestion('6. Enter Spreadsheet ID for file5.xlsx: ');
    const spreadsheetF = await askQuestion('7. Enter Spreadsheet ID for file6.xlsx: ');
    const spreadsheetG = await askQuestion('8. Enter Spreadsheet ID for file7.xlsx: ');
    const spreadsheetH = await askQuestion('9. Enter Spreadsheet ID for file8.xlsx: ');
    const spreadsheetI = await askQuestion('10. Enter Spreadsheet ID for file9.xlsx: ');
    
    // Update config.js
    const configContent = `// Configuration file for the Telegram Bot
// You can set these values directly or use environment variables

module.exports = {
  // Telegram Bot Token - Get this from @BotFather on Telegram
  BOT_TOKEN: process.env.BOT_TOKEN || '${botToken}',
  
  // Google Sheets IDs - Get these from your Google Sheets URLs
  SPREADSHEET_ID_A: process.env.SPREADSHEET_ID_A || '${spreadsheetA}',
  SPREADSHEET_ID_B: process.env.SPREADSHEET_ID_B || '${spreadsheetB}', 
  SPREADSHEET_ID_C: process.env.SPREADSHEET_ID_C || '${spreadsheetC}',
  SPREADSHEET_ID_D: process.env.SPREADSHEET_ID_D || '${spreadsheetD}',
  SPREADSHEET_ID_E: process.env.SPREADSHEET_ID_E || '${spreadsheetE}',
  SPREADSHEET_ID_F: process.env.SPREADSHEET_ID_F || '${spreadsheetF}',
  SPREADSHEET_ID_G: process.env.SPREADSHEET_ID_G || '${spreadsheetG}',
  SPREADSHEET_ID_H: process.env.SPREADSHEET_ID_H || '${spreadsheetH}',
  SPREADSHEET_ID_I: process.env.SPREADSHEET_ID_I || '${spreadsheetI}',
  
  // Google Sheets API Credentials path
  GOOGLE_CREDENTIALS_PATH: process.env.GOOGLE_CREDENTIALS_PATH || './credentials.json'
};`;

    fs.writeFileSync('config.js', configContent);
    
    console.log('\n✅ Configuration saved to config.js');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure you have credentials.json in the project root');
    console.log('2. Run: npm start');
    console.log('\n🔧 If you need to update credentials.json:');
    console.log('- Download it from Google Cloud Console');
    console.log('- Save it as credentials.json in this folder');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setup();
