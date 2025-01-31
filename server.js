const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Enhanced language mapping with version indices and default includes
const languageConfig = {
  'python': { 
    id: 'python3', 
    version: '4',
    wrapper: (code) => code
  },
  'javascript': { 
    id: 'nodejs', 
    version: '4',
    wrapper: (code) => code
  },
  'cpp': { 
    id: 'cpp17', 
    version: '1',
    wrapper: (code) => {
      if (!code.includes('main')) {
        return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

int main() {
    ${code}
    return 0;
}`;
      }
      return code;
    }
  },
  'c': { 
    id: 'c', 
    version: '5',
    wrapper: (code) => {
      if (!code.includes('main')) {
        return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    ${code}
    return 0;
}`;
      }
      return code;
    }
  },
  'java': { 
    id: 'java', 
    version: '4',
    wrapper: (code) => code
  }
};

app.post('/api/execute', async (req, res) => {
  try {
    const { language, code } = req.body;
    
    if (!language || !code) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'Both language and code are required'
      });
    }

    const langConfig = languageConfig[language.toLowerCase()];
    
    if (!langConfig) {
      return res.status(400).json({
        error: 'Invalid language',
        details: `Language '${language}' is not supported`
      });
    }

    // Process code through language-specific wrapper
    const processedCode = langConfig.wrapper(code);

    console.log('Executing code:', {
      language: langConfig.id,
      version: langConfig.version,
      codeLength: processedCode.length
    });

    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: processedCode,
      language: langConfig.id,
      versionIndex: langConfig.version
    });

    // Enhanced error checking for JDoodle response
    if (response.data.statusCode >= 400) {
      throw new Error(response.data.output || 'Compilation failed');
    }

    // Check for common C++ runtime errors in output
    const output = response.data.output || '';
    if (output.includes('segmentation fault') || 
        output.includes('runtime error') ||
        output.includes('abort')) {
      return res.json({
        error: true,
        output: `Runtime Error: ${output}`,
        cplusplus: true
      });
    }

    return res.json(response.data);
  } catch (error) {
    console.error('Error executing code:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    
    return res.status(error.response?.status || 500).json({
      error: 'Code execution failed',
      details: error.response?.data?.output || error.message,
      compilationError: error.response?.data?.compilationError || false
    });
  }
});

const PORT = process.env.PORT || 3000;

if (!process.env.JDOODLE_CLIENT_ID || !process.env.JDOODLE_CLIENT_SECRET) {
  console.error('Missing required environment variables. Please check your .env file.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Server configuration:', {
    supportedLanguages: Object.keys(languageConfig),
    port: PORT
  });
});
