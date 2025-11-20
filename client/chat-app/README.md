# Chat App Client

A real-time chat application built with React, Vite, and Socket.IO. This client provides a modern, responsive interface for messaging with glass morphism design effects.

## Features

- Real-time messaging with Socket.IO
- User authentication (login/register)
- Responsive design with Tailwind CSS
- Glass morphism UI effects
- Typing indicators
- Message animations

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- A running instance of the chat server (see server README)

## Installation

1. Clone the repository and navigate to the client directory:
   ```bash
   cd client/chat-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173` (or the port shown in the terminal).

3. Ensure the backend server is running on its designated port (typically 3000) for full functionality.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the app for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## Project Structure

```
src/
├── components/
│   ├── chat/          # Chat-related components
│   ├── layout/        # Layout components (Header, Sidebar)
│   └── ui/            # Reusable UI components
├── context/           # React contexts (Auth, Socket)
├── hooks/             # Custom hooks
├── pages/             # Page components (Chat, Login, Register)
├── services/          # API services
├── socket/            # Socket.IO client setup
└── assets/            # Static assets
```

## Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **Axios** - HTTP client

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Test your changes
6. Submit a pull request

## License

This project is private and not licensed for public use.