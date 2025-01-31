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

// Enhanced language mapping with proper input handling
const languageConfig = {
  'python': { 
    id: 'python3', 
    version: '4',
    wrapper: (code, input) => {
      if (code.includes('input(')) return code;
      return `
import sys
input_values = """${input}""".strip().split('\\n')
input_counter = 0

def custom_input(prompt=""):
    global input_counter
    if input_counter < len(input_values):
        value = input_values[input_counter]
        input_counter += 1
        return value
    return ""

input = custom_input

${code}`;
    }
  },
  'cpp': { 
    id: 'cpp17', 
    version: '1',
    wrapper: (code, input) => {
      if (code.includes('main')) return code;
      
      // Properly escape and format the input
      const formattedInput = input
        .split('\n')
        .map(line => line.trim())
        .join('\\n');

      return `#include <iostream>
#include <sstream>
#include <string>
#include <vector>
using namespace std;

int main() {
    istringstream cin("${formattedInput}");
    ${code}
    return 0;
}`;
    }
  },
  'c': { 
    id: 'c', 
    version: '5',
    wrapper: (code, input) => {
      if (code.includes('main')) return code;
      
      const formattedInput = input
        .split('\n')
        .map(line => line.trim())
        .join('\\n');

      return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Create a temporary file for input
    FILE* temp = tmpfile();
    fprintf(temp, "${formattedInput}\\n");
    rewind(temp);
    
    // Redirect stdin to use the temporary file
    stdin = temp;
    
    ${code}
    
    fclose(temp);
    return 0;
}`;
    }
  },
  'javascript': { 
    id: 'nodejs', 
    version: '4',
    wrapper: (code, input) => {
      if (code.includes('process.stdin')) return code;
      return `
const input = \`${input}\`.trim().split('\\n');
let inputIndex = 0;

function getNextInput() {
    return input[inputIndex++] || '';
}

${code}`;
    }
  }
};

app.post('/api/execute', async (req, res) => {
  try {
    const { language, code, input = '' } = req.body;
    
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

    // Clean and validate input
    const cleanedInput = input
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();

    // Process code through language-specific wrapper
    const processedCode = langConfig.wrapper(code, cleanedInput);

    console.log('Executing code:', {
      language: langConfig.id,
      version: langConfig.version,
      hasInput: Boolean(cleanedInput)
    });

    const response = await axios.post('https://api.jdoodle.com/v1/execute', {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: processedCode,
      language: langConfig.id,
      versionIndex: langConfig.version,
      stdin: cleanedInput
    });

    // Check for compilation/runtime errors
    if (response.data.statusCode >= 400) {
      return res.json({
        error: true,
        output: response.data.output || 'Compilation failed'
      });
    }

    return res.json(response.data);
  } catch (error) {
    console.error('Error executing code:', {
      message: error.message,
      response: error.response?.data
    });
    
    return res.status(error.response?.status || 500).json({
      error: 'Code execution failed',
      details: error.response?.data?.output || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;

// Validate environment variables before starting
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
