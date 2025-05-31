import { ComfyApp } from '@comfyorg/comfyui-frontend-types'
import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { useTranslation } from 'react-i18next'

import './index.css'
import './utils/i18n'

// Declare global ComfyUI objects
declare global {
  interface Window {
    app?: ComfyApp
  }
}

// Lazy load the App component for better performance
const App = React.lazy(() => import('./App'))

// Function to wait for document and app to be ready
function waitForInit(): Promise<void> {
  return new Promise((resolve) => {
    // Check if document is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', checkApp)
    } else {
      checkApp()
    }

    // Check if app is available
    function checkApp() {
      if (window.app) {
        resolve()
      } else {
        // Poll for app availability
        const interval = setInterval(() => {
          if (window.app) {
            console.log('App initialized')
            clearInterval(interval)
            resolve()
          }
        }, 50)

        // Set timeout to avoid infinite polling
        setTimeout(() => {
          clearInterval(interval)
          console.error('Timeout waiting for app to initialize')
          resolve() // Continue anyway to avoid blocking
        }, 5000)
      }
    }
  })
}

// Initialize the extension once everything is ready
async function initializeExtension(): Promise<void> {
  try {
    // Wait for document and ComfyUI app
    await waitForInit()
    console.log('App:', window.app)

    if (!window.app) {
      console.error('ComfyUI app not available')
      return
    }

    // Create a function component with i18n for translation
    function SidebarWrapper() {
      // Using useTranslation hook to initialize i18n context
      useTranslation()
      return <App />
    }

    // Register the sidebar tab using ComfyUI's extension API
    const sidebarTab = {
      id: 'comfyui-react-example',
      icon: 'pi pi-code', // Using PrimeVue icon
      title: 'React Example',
      tooltip: 'React Example Extension',
      type: 'custom' as const,
      render: (element: HTMLElement) => {
        console.log('Rendering React Example Extension')
        // Create a container for our React app
        const container = document.createElement('div')
        container.id = 'comfyui-react-example-root'
        container.style.height = '100%'
        element.appendChild(container)

        // Mount the React app to the container
        ReactDOM.createRoot(container).render(
          <React.StrictMode>
            <Suspense fallback={<div>Loading...</div>}>
              <SidebarWrapper />
            </Suspense>
          </React.StrictMode>
        )
      }
    }

    window.app.extensionManager.registerSidebarTab(sidebarTab)

    // Register extension with about page badges
    window.app.registerExtension({
      name: 'ReactExtensionExample',
      // About Panel Badges API - Adds custom badges to the ComfyUI about page
      aboutPageBadges: [
        {
          label: 'Documentation',
          url: 'https://docs.comfy.org/custom-nodes/js/javascript_overview',
          icon: 'pi pi-file'
        },
        {
          label: 'GitHub',
          url: 'https://github.com/Comfy-Org/ComfyUI-React-Extension-Template',
          icon: 'pi pi-github'
        },
        {
          label: 'Support',
          url: 'https://discord.gg/comfy-org',
          icon: 'pi pi-discord'
        }
      ],

      // Bottom Panel Tabs API - Adds custom tabs to the bottom panel
      bottomPanelTabs: [
        {
          id: 'react-example-tab',
          title: 'React Example Tab',
          type: 'custom',
          render: (el) => {
            // Create a container for our React content
            const container = document.createElement('div')
            container.id = 'react-example-bottom-tab'
            container.style.padding = '10px'
            el.appendChild(container)

            // Create a React component for the tab content
            function TabContent() {
              const [count, setCount] = React.useState(0)

              return (
                <div style={{ padding: '10px' }}>
                  <h3>React Example Bottom Panel</h3>
                  <p>This is a demo of the Bottom Panel Tabs API.</p>
                  <p>Count: {count}</p>
                  <button
                    onClick={() => setCount(count + 1)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Increment
                  </button>
                </div>
              )
            }

            // Mount the React component
            ReactDOM.createRoot(container).render(
              <React.StrictMode>
                <TabContent />
              </React.StrictMode>
            )
          }
        }
      ],

      // Commands and Keybindings API - Register custom commands with keyboard shortcuts
      commands: [
        {
          id: 'reactExample.showInfo',
          label: 'Show React Example Info',
          function: () => {
            alert(
              'React Example Extension - This command was triggered by the Commands API'
            )
          }
        },
        {
          id: 'reactExample.runWorkflow',
          label: 'Run Workflow from React Example',
          function: () => {
            void window.app?.queuePrompt(0) // Pass 0 as default prompt number
          }
        },
        {
          id: 'reactExample.clearWorkflow',
          label: 'Clear Workflow from React Example',
          function: () => {
            if (confirm('Clear the current workflow? This cannot be undone.')) {
              window.app?.graph.clear()
            }
          }
        }
      ],

      // Associate keybindings with the commands
      keybindings: [
        {
          combo: { key: 'i', ctrl: true, alt: true },
          commandId: 'reactExample.showInfo'
        },
        {
          combo: { key: 'r', ctrl: true, alt: true },
          commandId: 'reactExample.runWorkflow'
        },
        {
          combo: { key: 'Delete', ctrl: true, alt: true },
          commandId: 'reactExample.clearWorkflow'
        }
      ],

      // Topbar Menu API - Add commands to the top menu bar
      menuCommands: [
        {
          // Add commands to the Extensions menu
          path: ['Extensions', 'React Example'],
          commands: [
            'reactExample.showInfo',
            'reactExample.runWorkflow',
            'reactExample.clearWorkflow'
          ]
        },
        {
          // Create a submenu under Extensions > React Example
          path: ['Extensions', 'React Example', 'Advanced'],
          commands: ['reactExample.showInfo']
        }
      ]
    })

    console.log('React Example Extension initialized successfully')
  } catch (error) {
    console.error('Failed to initialize React Example Extension:', error)
  }
}

// Start initialization
void initializeExtension()
