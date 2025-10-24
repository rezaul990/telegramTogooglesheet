const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const XLSX = require('xlsx');
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Configuration
const config = require('./config');
const BOT_TOKEN = config.BOT_TOKEN;
const GOOGLE_CREDENTIALS_PATH = config.GOOGLE_CREDENTIALS_PATH;
const GOOGLE_SHEETS_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// File to Spreadsheet mapping based on file name patterns
function getSpreadsheetId(fileName) {
  // Remove file extension for pattern matching
  const nameWithoutExt = fileName.replace(/\.(xlsx?|xls)$/i, '');
  
  // Pattern matching for specific file names
  if (nameWithoutExt.includes('OverdueAccountsDetails')) {
    return config.SPREADSHEET_ID_A;
  } else if (nameWithoutExt.includes('Risk_Hire_Accounts')) {
    return config.SPREADSHEET_ID_B;
  } else if (nameWithoutExt.includes('PsdAreaARReceivable')) {
    return config.SPREADSHEET_ID_C;
  } else if (nameWithoutExt.includes('Tr_vs_Achv_2023_All')) {
    return config.SPREADSHEET_ID_D;
  }
  
  return null; // File not supported
}

// Initialize Telegram Bot
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Initialize Google Sheets API
let sheets;
let auth;

async function initializeGoogleSheets() {
  try {
    const credentials = JSON.parse(fs.readFileSync(GOOGLE_CREDENTIALS_PATH, 'utf8'));
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: GOOGLE_SHEETS_SCOPES
    });
    
    sheets = google.sheets({ version: 'v4', auth });
    console.log('✅ Google Sheets API initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Google Sheets API:', error.message);
    throw error;
  }
}

// Download file from Telegram
async function downloadFile(fileId, fileName) {
  try {
    const fileLink = await bot.getFileLink(fileId);
    const response = await axios({
      method: 'GET',
      url: fileLink,
      responseType: 'stream'
    });
    
    const filePath = path.join(__dirname, 'temp', fileName);
    
    // Ensure temp directory exists
    if (!fs.existsSync(path.join(__dirname, 'temp'))) {
      fs.mkdirSync(path.join(__dirname, 'temp'));
    }
    
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error('❌ Failed to download file:', error.message);
    throw error;
  }
}

// Parse Excel file and convert to 2D array
function parseExcelFile(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // Use first sheet
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // Convert to 2D array and filter out empty rows
    const dataArray = jsonData.filter(row => row.length > 0 && row.some(cell => cell !== undefined && cell !== ''));
    
    console.log(`✅ Parsed Excel file: ${dataArray.length} rows found`);
    return dataArray;
  } catch (error) {
    console.error('❌ Failed to parse Excel file:', error.message);
    throw error;
  }
}

// Update Google Sheets
async function updateGoogleSheet(spreadsheetId, data) {
  try {
    // Clear existing data in Sheet1
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: 'Sheet1!A:Z'
    });
    
    // Write new data
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      resource: {
        values: data
      }
    });
    
    console.log(`✅ Successfully updated Google Sheet: ${spreadsheetId}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to update Google Sheet:', error.message);
    throw error;
  }
}

// Clean up temporary files
function cleanupTempFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log('✅ Cleaned up temporary file');
    }
  } catch (error) {
    console.error('❌ Failed to clean up temporary file:', error.message);
  }
}

// Handle incoming messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // Handle text messages
  if (messageText) {
    if (messageText === '/start') {
      await bot.sendMessage(chatId, 
        '🤖 Welcome to Excel to Google Sheets Bot!\n\n' +
        'Send me an Excel file (.xlsx or .xls) and I\'ll update the corresponding Google Sheet.\n\n' +
        'Supported files:\n' +
        '• OverdueAccountsDetails*.xlsx/.xls → Spreadsheet A\n' +
        '• Risk_Hire_Accounts*.xlsx/.xls → Spreadsheet B\n' +
        '• PsdAreaARReceivable*.xlsx/.xls → Spreadsheet C\n' +
        '• Tr_vs_Achv_2023_All*.xlsx/.xls → Spreadsheet D'
      );
    } else if (messageText === '/help') {
      await bot.sendMessage(chatId,
        '📋 How to use this bot:\n\n' +
        '1. Send an Excel file (.xlsx or .xls) with one of these name patterns:\n' +
        '   • OverdueAccountsDetails*.xlsx/.xls → Spreadsheet A\n' +
        '   • Risk_Hire_Accounts*.xlsx/.xls → Spreadsheet B\n' +
        '   • PsdAreaARReceivable*.xlsx/.xls → Spreadsheet C\n' +
        '   • Tr_vs_Achv_2023_All*.xlsx/.xls → Spreadsheet D\n\n' +
        '2. The bot will automatically:\n' +
        '   • Download and parse your Excel file\n' +
        '   • Update the corresponding Google Sheet\n' +
        '   • Send you a confirmation message\n\n' +
        'Commands:\n' +
        '/start - Start the bot\n' +
        '/help - Show this help message'
      );
    }
  }
  
  // Handle document messages (Excel files)
  if (msg.document) {
    const fileName = msg.document.file_name;
    const fileId = msg.document.file_id;
    
    console.log(`📄 Received file: ${fileName}`);
    
    // Check if file is supported
    if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
      await bot.sendMessage(chatId, '❌ Please send an Excel file (.xlsx or .xls)');
      return;
    }
    
    // Check if file is mapped to a spreadsheet
    const spreadsheetId = getSpreadsheetId(fileName);
    if (!spreadsheetId) {
      await bot.sendMessage(chatId, 
        `❌ File "${fileName}" is not supported.\n\n` +
        'Supported files:\n' +
        '• OverdueAccountsDetails*.xlsx/.xls → Spreadsheet A\n' +
        '• Risk_Hire_Accounts*.xlsx/.xls → Spreadsheet B\n' +
        '• PsdAreaARReceivable*.xlsx/.xls → Spreadsheet C\n' +
        '• Tr_vs_Achv_2023_All*.xlsx/.xls → Spreadsheet D'
      );
      return;
    }
    
    try {
      // Send processing message
      const processingMsg = await bot.sendMessage(chatId, '⏳ Processing your Excel file...');
      
      // Download file
      const filePath = await downloadFile(fileId, fileName);
      
      // Parse Excel file
      const data = parseExcelFile(filePath);
      
      // Update Google Sheet
      await updateGoogleSheet(spreadsheetId, data);
      
      // Clean up temporary file
      cleanupTempFile(filePath);
      
      // Send success message
      await bot.editMessageText(
        `✅ Successfully updated Google Sheet!\n\n` +
        `📊 File: ${fileName}\n` +
        `📈 Rows processed: ${data.length}\n` +
        `🔗 Spreadsheet ID: ${spreadsheetId}`,
        { chat_id: chatId, message_id: processingMsg.message_id }
      );
      
    } catch (error) {
      console.error('❌ Error processing file:', error.message);
      
      // Clean up temporary file if it exists
      const filePath = path.join(__dirname, 'temp', fileName);
      cleanupTempFile(filePath);
      
      // Send error message
      await bot.sendMessage(chatId, 
        `❌ Failed to process file "${fileName}"\n\n` +
        `Error: ${error.message}\n\n` +
        'Please check your file format and try again.'
      );
    }
  }
});

// Handle errors
bot.on('error', (error) => {
  console.error('❌ Telegram Bot Error:', error.message);
});

bot.on('polling_error', (error) => {
  console.error('❌ Telegram Bot Polling Error:', error.message);
});

// Initialize and start the bot
async function startBot() {
  try {
    // Validate required environment variables
    if (!BOT_TOKEN) {
      throw new Error('BOT_TOKEN environment variable is required');
    }
    
    if (!config.SPREADSHEET_ID_A || !config.SPREADSHEET_ID_B || !config.SPREADSHEET_ID_C || !config.SPREADSHEET_ID_D) {
      throw new Error('All SPREADSHEET_ID values are required in config.js');
    }
    
    // Initialize Google Sheets API
    await initializeGoogleSheets();
    
    console.log('🤖 Telegram Bot started successfully!');
    console.log('📋 Ready to process Excel files and update Google Sheets');
    
    // Start HTTP server for Render (required for web services)
    const PORT = process.env.PORT || 3000;
    const server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'Bot is running',
        timestamp: new Date().toISOString(),
        message: 'Telegram Excel to Google Sheets Bot is active'
      }));
    });
    
    server.listen(PORT, () => {
      console.log(`🌐 HTTP server running on port ${PORT}`);
      console.log(`📡 Health check available at: http://localhost:${PORT}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start bot:', error.message);
    process.exit(1);
  }
}

// Start the bot
startBot();
