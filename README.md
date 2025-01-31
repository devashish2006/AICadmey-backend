# Online Code Editor with Multi-Language Support

A real-time code editor and execution environment supporting Python, C++, C, and JavaScript. Built with React and Express, powered by JDoodle API for code execution.

## 🚀 Features

- **Multi-Language Support**
  - Python (Python 3)
  - C++ (C++17)
  - C
  - JavaScript (Node.js)

- **Real-Time Code Execution**
  - Instant feedback
  - Error handling
  - Compilation status
  - Runtime error detection

- **User Interface**
  - Syntax highlighting
  - Dark/Light theme toggle
  - Responsive design
  - Code output display

## 💻 Tech Stack

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - shadcn/ui components
  - Axios

- Backend:
  - Express.js
  - Node.js
  - JDoodle API integration

## 🛠️ Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- JDoodle API credentials

### Environment Variables

1. Create `.env` file in the server directory:
```env
JDOODLE_CLIENT_ID=your_client_id
JDOODLE_CLIENT_SECRET=your_client_secret
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

2. Create `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:3000
```

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd [project-name]
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd server
npm start
```

2. Start the frontend development server:
```bash
cd client
npm run dev
```

## 📝 Usage Examples

### Python
```python
print("Hello, World!")
```

### C++
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```

### C
```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

### JavaScript
```javascript
console.log("Hello, World!");
```

## 🔍 Error Handling

The application handles various types of errors:
- Compilation errors
- Runtime errors
- Network connectivity issues
- API limitations
- Language-specific errors

## 🛡️ Security

- Environment variables for sensitive data
- CORS configuration
- Input validation
- Error message sanitization

## ⚙️ Configuration

### Language Configurations
- Python: Version 3
- C++: C++17 standard
- C: Latest C standard
- JavaScript: Node.js environment

### Server Configuration
- Custom port configuration
- CORS settings
- Error logging
- Request rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [JDoodle API](https://www.jdoodle.com/compiler-api) for code execution
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Contact

For any queries or support:
- Email: your-logicunit64@gmail.com
