# Telegram Excel to Google Sheets Bot

A Node.js Telegram bot that automatically processes Excel files and updates Google Sheets. Users can send Excel files via Telegram, and the bot will parse them and update the corresponding Google Sheet.

## Features

- 🤖 **Telegram Bot Integration**: Handles file uploads and user interactions
- 📊 **Excel File Processing**: Parses .xlsx and .xls files using the xlsx library
- 📈 **Google Sheets Integration**: Automatically updates Google Sheets via API
- 🔄 **File Mapping**: Maps specific filenames to different Google Sheets
- ✅ **Error Handling**: Comprehensive error handling with user feedback
- 🚀 **Render Ready**: Configured for easy deployment on Render

## File Mapping

The bot maps specific filename patterns to Google Sheets:

- `OverdueAccountsDetails*.xlsx/.xls` → Spreadsheet ID A (Sheet1)
- `Risk_Hire_Accounts*.xlsx/.xls` → Spreadsheet ID B (Sheet1)  
- `PsdAreaARReceivable*.xlsx/.xls` → Spreadsheet ID C (Sheet1)
- `Tr_vs_Achv_2023_All*.xlsx/.xls` → Spreadsheet ID D (Sheet1)
- `TrAchvPeriodWiseOld2025*.xlsx/.xls` → Spreadsheet ID E (Sheet1)
- `Unique_Ac_Receivable_All*.xlsx/.xls` → Spreadsheet ID F (Sheet1)
- `EBS*.xlsx/.xls` → Spreadsheet ID G (Sheet1)
- `Cor*.xlsx/.xls` → Spreadsheet ID H (Sheet1)

## Prerequisites

1. **Node.js** (version 16 or higher)
2. **Telegram Bot Token** - Get from [@BotFather](https://t.me/botfather)
3. **Google Cloud Project** with Sheets API enabled
4. **Google Service Account** with credentials
5. **Google Sheets** with proper permissions

## Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd telegram-excel-sheets-bot
npm install
```

### 2. Create Telegram Bot

1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Use `/newbot` command
3. Follow the instructions to create your bot
4. Save the bot token

### 3. Set up Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Sheets API
4. Create a Service Account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Fill in the details and create
5. Generate credentials:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key" → "JSON"
   - Download the JSON file

### 4. Configure Google Sheets

1. Create 3 Google Sheets (or use existing ones)
2. Share each sheet with your service account email (found in the JSON file)
3. Give "Editor" permissions
4. Copy the Spreadsheet IDs from the URLs:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

### 5. Environment Configuration

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Update `.env` with your values:
   ```env
BOT_TOKEN=your_telegram_bot_token_here
SPREADSHEET_ID_A=your_spreadsheet_id_for_file1
SPREADSHEET_ID_B=your_spreadsheet_id_for_file2
SPREADSHEET_ID_C=your_spreadsheet_id_for_file3
SPREADSHEET_ID_D=your_spreadsheet_id_for_file4
SPREADSHEET_ID_E=your_spreadsheet_id_for_file5
SPREADSHEET_ID_F=your_spreadsheet_id_for_file6
SPREADSHEET_ID_G=your_spreadsheet_id_for_file7
SPREADSHEET_ID_H=your_spreadsheet_id_for_file8
GOOGLE_CREDENTIALS_PATH=./credentials.json
   ```

3. Rename your downloaded Google credentials file:
   ```bash
   mv your-downloaded-credentials.json credentials.json
   ```

### 6. Test Locally

```bash
npm start
```

The bot should start and show:
```
✅ Google Sheets API initialized successfully
🤖 Telegram Bot started successfully!
📋 Ready to process Excel files and update Google Sheets
```

## Usage

1. Start a conversation with your bot on Telegram
2. Send `/start` to see the welcome message
3. Send an Excel file with one of these name patterns:
   - `OverdueAccountsDetails*.xlsx/.xls` → Updates Spreadsheet A
   - `Risk_Hire_Accounts*.xlsx/.xls` → Updates Spreadsheet B
   - `PsdAreaARReceivable*.xlsx/.xls` → Updates Spreadsheet C
   - `Tr_vs_Achv_2023_All*.xlsx/.xls` → Updates Spreadsheet D
   - `TrAchvPeriodWiseOld2025*.xlsx/.xls` → Updates Spreadsheet E
   - `Unique_Ac_Receivable_All*.xlsx/.xls` → Updates Spreadsheet F
   - `EBS*.xlsx/.xls` → Updates Spreadsheet G
   - `Cor*.xlsx/.xls` → Updates Spreadsheet H
4. The bot will process the file and update the corresponding Google Sheet
5. You'll receive a confirmation message

## Deployment on Render

### 1. Prepare for Deployment

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Make sure all environment variables are configured
3. Ensure `credentials.json` is included in your repository (or use environment variables)

### 2. Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `telegram-excel-sheets-bot`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid plan)

### 3. Environment Variables on Render

Add these environment variables in your Render service settings:

- `BOT_TOKEN`: Your Telegram bot token
- `SPREADSHEET_ID_A`: Spreadsheet ID for file1.xlsx
- `SPREADSHEET_ID_B`: Spreadsheet ID for file2.xlsx  
- `SPREADSHEET_ID_C`: Spreadsheet ID for file3.xlsx
- `SPREADSHEET_ID_D`: Spreadsheet ID for file4.xlsx
- `SPREADSHEET_ID_E`: Spreadsheet ID for file5.xlsx
- `SPREADSHEET_ID_F`: Spreadsheet ID for file6.xlsx
- `SPREADSHEET_ID_G`: Spreadsheet ID for file7.xlsx
- `SPREADSHEET_ID_H`: Spreadsheet ID for file8.xlsx
- `GOOGLE_CREDENTIALS_PATH`: `./credentials.json`

### 4. Google Credentials on Render

You have two options for Google credentials:

**Option A: Include credentials.json in repository**
- Add `credentials.json` to your repository
- Set `GOOGLE_CREDENTIALS_PATH=./credentials.json`

**Option B: Use environment variables (recommended for production)**
- Convert your credentials.json to environment variables
- Set each field as a separate environment variable in Render

### 5. Deploy

Click "Create Web Service" and wait for deployment to complete.

## File Structure

```
telegram-excel-sheets-bot/
├── bot.js                    # Main bot application
├── package.json             # Dependencies and scripts
├── credentials.json         # Google Sheets API credentials
├── credentials.json.template # Template for credentials
├── env.example              # Environment variables template
├── render.yaml              # Render deployment configuration
├── .gitignore               # Git ignore rules
├── README.md                # This file
└── temp/                    # Temporary files (auto-created)
```

## API Reference

### Bot Commands

- `/start` - Welcome message and instructions
- `/help` - Detailed help information

### Supported File Types

- `.xlsx` and `.xls` Excel files
- Files must match these name patterns:
  - `OverdueAccountsDetails*.xlsx/.xls` → Spreadsheet A
  - `Risk_Hire_Accounts*.xlsx/.xls` → Spreadsheet B
  - `PsdAreaARReceivable*.xlsx/.xls` → Spreadsheet C
  - `Tr_vs_Achv_2023_All*.xlsx/.xls` → Spreadsheet D
  - `TrAchvPeriodWiseOld2025*.xlsx/.xls` → Spreadsheet E
  - `Unique_Ac_Receivable_All*.xlsx/.xls` → Spreadsheet F
  - `EBS*.xlsx/.xls` → Spreadsheet G
  - `Cor*.xlsx/.xls` → Spreadsheet H

### Google Sheets Integration

- Clears existing data in Sheet1
- Writes new data starting from A1
- Supports any number of rows and columns
- Filters out empty rows automatically

## Troubleshooting

### Common Issues

1. **Bot not responding**
   - Check if BOT_TOKEN is correct
   - Verify the bot is running and connected

2. **Google Sheets API errors**
   - Verify credentials.json is valid
   - Check if service account has access to sheets
   - Ensure Google Sheets API is enabled

3. **File processing errors**
   - Check if file is .xlsx format
   - Verify filename matches exactly (case-sensitive)
   - Ensure file is not corrupted

4. **Render deployment issues**
   - Check environment variables are set
   - Verify credentials.json is accessible
   - Check build logs for errors

### Logs

The bot provides detailed logging:
- ✅ Success messages
- ❌ Error messages with details
- 📄 File processing information
- 🔄 API operation status

## Security Notes

- Never commit `credentials.json` to public repositories
- Use environment variables for production deployments
- Regularly rotate your service account keys
- Monitor bot usage and set up alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the troubleshooting section
2. Review the logs for error details
3. Create an issue in the repository
4. Contact the maintainers

---

**Happy automating! 🤖📊**
