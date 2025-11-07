# 🎨 AI Manga Studio

![AI Manga Studio preview](/public/images/demo/ai-manga-studio-preview.png)

> A powerful AI-driven tool for creating manga with intelligent script generation, dynamic storyboard layout, and precise character style control.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript)](package.json)
[![Vite](https://img.shields.io/badge/Vite-7.1-646cff?logo=vite)](package.json)

## ✨ Features

- **🤖 AI Script Generation** - Generate compelling manga scripts using Google's Gemini AI
- **🎬 Intelligent Storyboarding** - Automatic panel layout and composition suggestions
- **👤 Character Management** - Create, customize, and manage character designs with pose control
- **🎨 Panel Editor** - Full-featured canvas editor for precise panel composition and positioning
- **🌍 Worldview Generator** - AI-powered background and setting generation for your stories
- **📹 Video Producer** - Convert your manga into dynamic video sequences
- **🌐 Multi-language Support** - Localization support for global audiences
- **📤 Export Options** - Export as PDF, ZIP, or other formats for distribution
- **⚙️ Masking Tools** - Advanced masking capabilities for selective editing
- **📊 Comparison Viewer** - Side-by-side comparison of generated results

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ or compatible runtime
- **npm** 8+ or yarn
- **Google Gemini API Key** for AI features

### Installation

```bash
# Clone the repository
git clone https://github.com/MontaCoder/AI-Manga-Studio.git
cd AI-Manga-Studio

# Install dependencies
npm install

# Configure your environment
# Add your Google Gemini API key when prompted in the app
```

### Development

```bash
# Start the development server
npm run dev

# The app will be available at http://localhost:5173
```

### Production Build

```bash
# Build for production
npm build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
src/
├── app/                          # Main application entry point
├── components/                   # Reusable UI components
│   ├── icons/                   # Icon components
│   ├── layout/                  # Layout components (Header, etc.)
│   └── modals/                  # Modal dialogs (API Key, Export, Masking)
├── contexts/                    # React Context providers
│   └── LocalizationContext.tsx # Language/localization management
├── features/                    # Feature-specific modules
│   ├── character-management/   # Character creation & styling
│   ├── panel-editor/           # Canvas-based panel editing
│   ├── story-generation/       # Story & worldview generation
│   └── video-producer/         # Video generation pipeline
├── hooks/                       # Custom React hooks
├── i18n/                        # Internationalization/locales
├── pages/                       # Page components
│   ├── landing/                # Landing page with features showcase
│   └── studio/                 # Main studio workspace
├── services/                    # API & external service integrations
│   ├── geminiClient.ts         # Google Gemini API client
│   ├── geminiService.ts        # High-level AI services
│   └── videoGeminiService.ts   # Video generation services
├── types/                       # TypeScript type definitions
└── utils/                       # Utility functions
    └── exportUtils.ts          # Export functionality
```

## 🛠️ Technology Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript 5.9** - Type-safe development
- **Vite 7.1** - Next-generation build tool
- **React Router 7.9** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework

### AI & Services
- **Google Gemini AI** - Core AI for content generation, image analysis, and video production
- **Google GenAI SDK** - Official client for Gemini API integration

### File Handling
- **jsPDF 3.0** - PDF export functionality
- **JSZip 3.10** - ZIP archive creation
- **FileSaver 2.0** - File download support

## 🎯 Core Features Explained

### Character Management
Create and manage characters with precise control over:
- Character attributes and descriptions
- Pose editor for dynamic character positioning
- Style consistency across multiple panels
- Multi-character support in scenes

### Panel Editor
A sophisticated canvas-based editing tool featuring:
- Drag-and-drop panel arrangement
- Customizable panel shapes and sizes
- Real-time preview and composition
- Grid-based alignment
- Undo/redo support

### Story Generation Workflow
1. **Input Story Premise** - Describe your manga concept
2. **Generate Worldview** - AI creates a detailed setting and background
3. **Get Story Suggestions** - Receive multiple plot variations
4. **Review & Customize** - Adjust and refine suggestions
5. **Create Storyboard** - Organize panels and sequences
6. **Export & Distribute** - Generate final output formats

### Video Production
Transform your static manga panels into animated sequences with:
- Automatic camera movements
- Panel-to-panel transitions
- Sound and music integration (via Gemini Video)
- Multiple export quality options

## 🔑 Configuration

### API Key Setup
The app requires a Google Gemini API key for AI features:

1. Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open the app and click the settings icon
3. Enter your API key in the modal dialog
4. API key is stored securely in your browser (localStorage)

### Environment Variables
Create a `.env` file if needed (optional):
```env
VITE_GEMINI_API_KEY=your_key_here
```

## 📖 How It Works

### The Three-Step Workflow

```
📝 Story Input → 🎨 Storyboard → 📤 Export
       ↓              ↓              ↓
  AI Script      Panel Editor    Multiple
  Generation     & Composition   Formats
```

1. **Story Input** - Describe your manga premise
2. **Storyboard Layout** - Arrange panels using the editor
3. **Export** - Download as PDF, ZIP, or video

## 🎨 Customization

### Styling
The project uses Tailwind CSS. Modify styling in:
- `src/app/index.css` - Global styles
- Component-level classes - Inline Tailwind classes

### Localization
Add new languages by editing:
- `src/i18n/locales.ts` - Language strings and translations

### Character Presets
Customize character generation in:
- `src/features/character-management/` - Character templates

## 📤 Export Formats

The app supports multiple export formats:
- **PDF** - Single or multi-page compilations
- **ZIP** - Complete project archive with assets
- **PNG/WebP** - Individual panel images
- **MP4** - Video sequences

## 🧪 Development

### Hot Module Replacement
Changes to files are automatically reflected in the browser during development.

### Type Checking
TypeScript is configured for strict type checking:
```bash
# Check types
npx tsc --noEmit
```

### Building
The project uses Vite for optimized builds:
- Tree-shaking of unused code
- Code splitting for optimal loading
- CSS and asset optimization

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- **Creator**: Montassar Hajri (MontaCoder)
- **AI Integration**: Google Gemini API
- **Framework**: React and Vite community

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the [official website](https://mangastudio.netlify.app)

## 🎓 Learning Resources

### Manga Creation Tips
- Start with a clear premise and character list
- Use the worldview generator to build consistent settings
- Leverage AI suggestions but always customize for your unique voice
- Export early and often to test your workflow

### Development
- Explore the `/src/features/` folder to understand feature architecture
- Check hook implementations in `/src/hooks/` for React patterns
- Review service integrations in `/src/services/` for API usage

## 🚧 Roadmap

Planned features and improvements:
- [ ] Offline support with local caching
- [ ] Collaborative editing features
- [ ] Advanced animation tools
- [ ] Mobile app support
- [ ] Community template library
- [ ] Custom model fine-tuning

---

**Made with ❤️ by Montassar Hajri**

Visit us at [mangastudio.netlify.app](https://mangastudio.netlify.app)
