# API Explorer

A beautiful, modern API testing tool built with Next.js, TypeScript, and Tailwind CSS. Features glass morphism design, animated backgrounds, and comprehensive API endpoint testing capabilities.

![API Explorer Preview](https://via.placeholder.com/800x400/63b5f2/ffffff?text=API+Explorer+Preview)

## ✨ Features

### 🎨 Design & UI
- **Glass Morphism Design**: Modern frosted glass containers with backdrop blur effects
- **Animated Background**: Smoothly animated gradient blobs that adapt to light/dark themes
- **Responsive Layout**: Mobile-first design that works perfectly on all devices
- **Theme Support**: Light and dark mode with system preference detection
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions

### 🔧 API Testing
- **Multiple HTTP Methods**: Support for GET, POST, PUT, DELETE, and more
- **Parameter Handling**: Path parameters, query parameters, and request bodies
- **Real-time Validation**: JSON validation for POST/PUT request bodies
- **Response Display**: Formatted JSON responses with status codes and timing
- **Content Type Support**: Renders HTML responses in iframes and pretty-prints JSON
- **Error Handling**: Comprehensive error display with network error support

### 📊 Sample APIs
- **Pre-loaded Endpoints**: JSONPlaceholder, HTTPBin, and custom API examples
- **Grouped Organization**: Endpoints organized by categories (Users, Posts, HTTPBin)
- **Expandable Sections**: Collapsible endpoint groups for better organization
- **Parameter Examples**: Pre-filled examples for easy testing
- **Custom Import**: Import your own OpenAPI/Swagger specifications (JSON/YAML)

### 🎯 User Experience
- **Compact Interface**: Expandable endpoint cards to save screen space
- **Inline Responses**: API responses displayed within endpoint containers
- **Theme Toggle**: Easy switching between light and dark modes
- **Keyboard Friendly**: Full keyboard navigation support

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **Git** for cloning the repository

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/api-explorer.git
   cd api-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 📖 Usage Guide

### Getting Started

1. **Load Sample API**: Click the "Load Sample API" button to populate the interface with example endpoints
2. **Browse Categories**: Expand different API categories (Users, Posts, HTTPBin) to see available endpoints
3. **Test Endpoints**: Click on any endpoint to expand it and reveal testing options

### Testing an Endpoint

1. **Expand Endpoint**: Click on the endpoint header to reveal parameters and controls
2. **Configure Parameters**:
   - **Path Parameters**: Replace `{param}` placeholders in URLs
   - **Query Parameters**: Add key-value pairs to the URL
   - **Request Body**: Enter JSON for POST/PUT requests with real-time validation
3. **Execute Request**: Click the "Execute" button to send the API request
4. **View Results**: Response appears below with status, timing, and formatted data:
   - **JSON responses** are pretty-printed with syntax highlighting
   - **HTML responses** are rendered in a secure iframe
   - **Text responses** are displayed with proper formatting

### Importing Custom APIs

1. **Click "Import Swagger"**: Opens the import dialog
2. **Choose Input Method**:
   - **Upload File**: Drag & drop or browse for JSON/YAML OpenAPI files
   - **Paste Text**: Directly paste your specification content
3. **Import**: Click "Import" to parse and load your API endpoints
4. **Test**: Your custom endpoints are now ready for testing

### Theme Switching

- Click the sun/moon icon in the top-right corner to toggle between light and dark themes
- Theme preference is automatically saved and restored on future visits

## 🛠️ Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Project Structure

```
api-explorer/
├── app/
│   ├── components/
│   │   ├── ApiEndpoint.tsx      # Individual endpoint component
│   │   ├── ApiResultDisplay.tsx # Response display component
│   │   ├── BackgroundBlobs.tsx  # Animated background
│   │   ├── ThemeProvider.tsx    # Theme context provider
│   │   └── ThemeToggle.tsx      # Theme switcher
│   ├── lib/
│   │   └── sampleData.ts        # Sample API definitions
│   ├── globals.css              # Global styles and Tailwind config
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Main application page
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

### Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom design system
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Font**: [Inter](https://fonts.google.com/specimen/Inter) from Google Fonts

### Key Dependencies

```json
{
  "next": "15.5.3",
  "react": "19.1.0",
  "framer-motion": "^12.23.16",
  "lucide-react": "^0.544.0",
  "tailwindcss": "^4"
}
```

## 🎨 Design System

### Colors
- **Primary**: `#63b5f2` (Blue)
- **Accent**: `#ff9800` (Orange)
- **Background**: Adaptive based on theme
- **Glass Effect**: Semi-transparent with backdrop blur

### Typography
- **Font Family**: Inter (sans-serif)
- **Weights**: 100-900 for various text elements
- **Sizes**: Responsive scaling from mobile to desktop

### Animations
- **Duration**: 300ms for most transitions
- **Easing**: Ease-in-out for smooth motion
- **Blob Animation**: 20-25 second cycles for background elements

## 🔧 Configuration

### Environment Variables

No environment variables are required for basic functionality. The app uses sample APIs that work out-of-the-box.

### Customizing Sample APIs

Edit `app/lib/sampleData.ts` to add your own API endpoints:

```typescript
export const sampleEndpoints: Endpoint[] = [
  {
    method: 'GET',
    url: 'https://api.example.com/users',
    description: 'Get all users',
    group: 'Users',
    parameters: [
      {
        name: 'limit',
        in: 'query',
        type: 'integer',
        example: 10,
      }
    ]
  }
];
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm run start
```

The application will be available on port 3000 in production mode.

### Deploy to Vercel

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Automatic Deployment**: Vercel will detect Next.js and deploy automatically
3. **Environment Variables**: Add any required environment variables in Vercel dashboard

### Other Platforms

The app can be deployed to any platform supporting Node.js:
- **Netlify**
- **Railway**
- **Render**
- **AWS Amplify**

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Run tests**: `npm run lint`
5. **Commit changes**: `git commit -m 'Add amazing feature'`
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add proper error handling
- Test API endpoints with real services when possible
- Update documentation for new features

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Framer Motion** for smooth animations
- **JSONPlaceholder** and **HTTPBin** for sample API endpoints

## 📞 Support

If you have questions or need help:

- **Issues**: [GitHub Issues](https://github.com/yourusername/api-explorer/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/api-explorer/discussions)
- **Email**: your.email@example.com

---

**Made with ❤️ using Next.js, TypeScript, and Tailwind CSS**
