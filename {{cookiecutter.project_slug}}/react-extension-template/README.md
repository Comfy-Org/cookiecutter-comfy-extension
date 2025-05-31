# {{cookiecutter.project_name}}

{{cookiecutter.project_short_description}}

> [!NOTE]
> This projected was created with a [cookiecutter](https://github.com/Comfy-Org/cookiecutter-comfy-extension) template. It helps you start writing custom nodes without worrying about the Python setup.

![react-example-demo](https://github.com/Comfy-Org/ComfyUI-React-Extension-Template/blob/assets-branch/docs/demo.gif)

![demo pic](https://github.com/Comfy-Org/ComfyUI-React-Extension-Template/blob/assets-branch/react-example-demo.png)

A minimal template for creating React/TypeScript frontend extensions for ComfyUI, with complete boilerplate setup.

📚 **[ComfyUI JavaScript Developer Documentation](https://docs.comfy.org/custom-nodes/js/javascript_overview)** - Learn how to use ComfyUI's powerful extension APIs.

## Features

- **React & TypeScript Integration**: Ready-to-use setup for creating modern UI components within ComfyUI
- **Internationalization Framework**: Built-in i18n support with English and Chinese examples
- **ComfyUI API Integration**: Properly typed access to ComfyUI's internal API
- **Full TypeScript Support**: Type-safe code using ComfyUI's official type definitions
- **Auto-Reload Development**: Watch mode for seamless development experience

## Installation

```bash
# Go to your ComfyUI custom_nodes directory
cd ComfyUI/custom_nodes

# Clone the repository
git clone https://github.com/Comfy-Org/ComfyUI-React-Extension-Template.git

# Build the React application
cd ComfyUI-React-Extension-Template/ui
npm install
npm run build

# Restart ComfyUI
```

## Usage

This template includes a simple example extension that displays workflow node statistics. After installation:

1. Look for the "React Example" tab in the ComfyUI sidebar
2. Click to open the example UI

When developing your own extension, you can:
1. Replace the example UI in App.tsx with your own components
2. Update the tab title and icon in main.tsx
3. Customize the extension's appearance and behavior

## Development

### Setup Development Environment

```bash
# Go to the UI directory
cd ui

# Install dependencies
npm install

# Start development mode (watches for changes)
npm run watch
```

### Available ComfyUI Extension APIs

This template provides access to ComfyUI's powerful JavaScript APIs through the official type definitions. You can use these APIs to build rich extensions:

- **Sidebar Tabs**: Create custom sidebar panels like this template demonstrates
- **Bottom Bar Panels**: Add panels to the bottom of the UI
- **Top Menu Items**: Add custom entries to the top menu
- **Context Menus**: Create custom context menus for the graph
- **Settings**: Add settings to the ComfyUI settings panel
- **Toasts**: Display notification messages
- **Commands**: Create and register custom commands
- **Hotkeys/Keybindings**: Register custom keyboard shortcuts
- **About Panel Badges**: Add badges to the about panel
- **App Events**: Listen to and respond to app events
- **Graph Manipulation**: Programmatically manipulate the workflow graph

For comprehensive documentation on all available APIs, see the [ComfyUI JavaScript Developer Documentation](https://docs.comfy.org/custom-nodes/js/javascript_overview).

### File Structure

```
ComfyUI-React-Extension-Template/
├── .github/                    # GitHub configurations
│   └── workflows/
│       └── publish.yml         # Automatic publishing workflow
├── __init__.py                 # Python entry point for ComfyUI integration
├── pyproject.toml              # Project metadata for ComfyUI Registry
├── locales/                    # Internationalization files
│   ├── en/
│   │   └── main.json           # English translations
│   └── zh/
│       └── main.json           # Chinese translations
└── ui/                         # React application
    ├── src/
    │   ├── App.tsx             # Main React component with example UI
    │   ├── App.css             # Styles for the example UI
    │   ├── index.css           # Global styles and theme variables
    │   ├── main.tsx            # Entry point for React app
    │   ├── __tests__/          # Unit tests for components
    │   │   └── dummy.test.tsx  # Example test
    │   └── utils/
    │       └── i18n.ts         # Internationalization setup
    ├── jest.config.js          # Jest testing configuration
    ├── jest.setup.js           # Testing environment setup
    ├── package.json            # npm dependencies
    ├── tsconfig.json           # TypeScript configuration
    └── vite.config.ts          # Build configuration
```

### TypeScript Support

This extension uses the official `@comfyorg/comfyui-frontend-types` package for type-safe interaction with ComfyUI APIs. To install it:

```bash
cd ui
npm install -D @comfyorg/comfyui-frontend-types
```

## Publishing to ComfyUI Registry

### Prerequisites

1. Set up a [Registry](https://registry.comfy.org) account
2. Create an API key at https://registry.comfy.org/nodes

### Steps to Publish

1. Install the comfy-cli tool:
   ```bash
   pip install comfy-cli
   ```

2. Verify your pyproject.toml has the correct metadata:
   ```toml
   [project]
   name = "your_extension_name"  # Use a unique name for your extension
   description = "Your extension description here."
   version = "0.1.0"  # Increment this with each update

   [tool.comfy]
   PublisherId = "your_publisher_id"  # Your Registry publisher ID
   DisplayName = "Your Extension Display Name"
   ```

3. Publish your extension:
   ```bash
   comfy-cli publish
   ```

4. When prompted, enter your API key

### Automatic Publishing with GitHub Actions

This template includes a GitHub Actions workflow that automatically publishes to the ComfyUI Registry whenever you update the version in pyproject.toml:

1. Go to your repository's Settings > Secrets and variables > Actions
2. Create a new repository secret called `REGISTRY_ACCESS_TOKEN` with your API key
3. Commit and push an update to pyproject.toml (e.g., increment the version number)
4. The GitHub Action will automatically run and publish your extension

The workflow configuration is already set up in `.github/workflows/publish.yml` and will trigger when:
- The `pyproject.toml` file is modified
- The changes are pushed to the `main` branch

## Unit Testing

This template includes a basic setup for unit testing with Jest and React Testing Library:

```bash
# Run tests
npm test

# Run tests in watch mode during development
npm run test:watch
```

Example tests can be found in the `src/__tests__` directory. The setup includes:

- Jest for running tests
- React Testing Library for testing components
- Mock implementation of the ComfyUI window.app object

## Resources

- [ComfyUI JS Extension Documentation](https://docs.comfy.org/custom-nodes/js/javascript_overview) - Official documentation for ComfyUI JavaScript Extensions
- [ComfyUI Registry Documentation](https://docs.comfy.org/registry/publishing) - Learn how to publish your extension
- [ComfyUI Frontend Repository](https://github.com/Comfy-Org/ComfyUI-Frontend) - The main ComfyUI frontend codebase
- [Official ComfyUI Frontend Types](https://www.npmjs.com/package/@comfyorg/comfyui-frontend-types) - TypeScript definitions for ComfyUI
- [React Extension Guide](REACT_EXTENSION_GUIDE.md) - Detailed guide for creating React extensions
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/reference/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve this template.

## License

MIT
