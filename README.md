# NSCS-CLOUD: AI API & Isolated Storage Layer

**NSCS-CLOUD** is a high-performance infrastructure layer designed to provide secure **AI API Access Management** and **Isolated Cloud Storage** for developers and enterprises.

Built with a focus on **Security**, **Scalability**, and **Developer Experience**, NSCS-CLOUD serves as a robust gateway between raw AI compute (Ollama/Llama3) and client applications.

---

## 🚀 Core Features

### 1. AI API Developer Portal
*   **Multi-Key Management**: Generate, label, and revoke multiple AI API keys for different environments.
*   **Sandbox Testing**: Integrated sandbox to test prompts against the NSCS-ALPHA-01 node.
*   **Direct API Access**: Professional POST endpoints (`/api/ai`) with strict API Key validation.
*   **Gateway Metadata**: Transparent metadata in AI responses showing Node IDs and Auth methods used.

### 2. Isolated Storage (Cloud Storage)
*   **Physical Isolation**: Files are stored in user-specific directories, physically isolated at the filesystem level.
*   **Streamlined Uploads**: Optimized file management (Upload, Download, Delete) with real-time progress monitoring.
*   **Infrastructure Monitoring**: Dashboard monitoring of storage usage and object counts.

### 3. Premium Developer UI
*   **Dark-Mode Infrastructure Aesthetics**: A high-end, monochrome/technical UI using Glassmorphism.
*   **Real-time Activity Feed**: Track every cluster action from your dashboard.
*   **Account Controls**: Self-service profile management, storage quota tracking, and security settings.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite), Tailwind CSS (for layout utilities), Lucide React (Icons).
*   **Backend**: Node.js, Express, Multer (File Handling), Axios (API Gateway).
*   **Security**: Isolated Storage Logic, Multi-Key Validation Layer, Environment-based configuration.
*   **AI Engine**: Configurable (Default: Ollama / Llama3).

---

## 📂 Project Structure

```bash
/project-root
│
├── /backend            # Node.js API Service
│   ├── /controllers    # Logic for Auth, Cloud, and AI
│   ├── /routes         # API endpoint definitions
│   ├── server.js       # Main server entry point
│   └── .env            # Private configuration
│
├── /frontend           # React / Vite Client
│   ├── /src/pages      # High-performance UI pages
│   └── /src/components # Reusable UI components
│
├── /database           # Local user database (Isolated)
└── /storage            # Physical user file storage (Isolated)
```

---

## 💿 Installation & Deployment

### Prerequisites
*   [Node.js](https://nodejs.org/) (v16+)
*   [Ollama](https://ollama.com/) (If running AI simulations locally)

### Backend Setup
1.  Enter the directory: `cd backend`
2.  Install dependencies: `npm install`
3.  Configure environment: Create a `.env` file (see `.env.example`):
    ```env
    PORT=5000
    OLLAMA_URL=http://localhost:11434/api/generate
    MODEL=llama3
    ```
4.  Start the service: `node server.js`

### Frontend Setup
1.  Enter the directory: `cd frontend`
2.  Install dependencies: `npm install`
3.  Start development server: `npm run dev -- --port 5174`

---

## 🛡️ Security Best Practices
*   **API Security**: Always include your `x-user-email` in request headers for storage operations.
*   **Key Rotation**: Regularly revoke and regenerate API keys via the Developer Portal.
*   **Isolation**: Keep the `storage/` and `database/` folders git-ignored (already configured in `.gitignore`).

---

## 🔗 Repository
[**github.com/kerdabderrahim-wq/nscs-cloud**](https://github.com/kerdabderrahim-wq/nscs-cloud)

---

**NSCS-CLOUD - Advanced AI API & Storage Infrastructure Layer**
