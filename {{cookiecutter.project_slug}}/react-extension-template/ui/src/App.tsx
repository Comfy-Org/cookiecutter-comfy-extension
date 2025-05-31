import { ComfyApp } from '@comfyorg/comfyui-frontend-types'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import './App.css'

// Type definitions for the global ComfyUI objects
declare global {
  interface Window {
    app?: ComfyApp
  }
}

// Interface for our processed node data
interface ProcessedNode {
  id: string | number
  title: string
  type: string
  category: string
  inputs: number
  outputs: number
  pos: [number, number]
}

// Type for category colors
type CategoryColors = Record<string, string>

const CATEGORY_COLORS: CategoryColors = {
  loaders: '#7e57c2',
  conditioning: '#26a69a',
  sampling: '#ef5350',
  latent: '#66bb6a',
  image: '#42a5f5',
  mask: '#ff9800',
  'conditioning/clip': '#26a69a',
  'image/postprocessing': '#ec407a',
  advanced: '#5c6bc0',
  _default: '#78909c'
}

interface NodeStatsChartProps {
  nodeCounts: Record<string, number>
  totalNodes: number
}

function NodeStatsChart({ nodeCounts, totalNodes }: NodeStatsChartProps) {
  // Only show the top 8 categories for the chart
  const topCategories = Object.entries(nodeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)

  const chartData = topCategories.map(([category, count]) => {
    return {
      category,
      count,
      percentage: Math.round((count / totalNodes) * 100)
    }
  })

  return (
    <div className="node-stats-chart">
      {chartData.map((item) => (
        <div key={item.category} className="chart-bar-container">
          <div
            className="chart-bar"
            style={{
              height: `${item.percentage * 2}px`,
              backgroundColor:
                CATEGORY_COLORS[item.category] || CATEGORY_COLORS._default
            }}
          />
          <div className="chart-label">{item.category}</div>
        </div>
      ))}
    </div>
  )
}

interface CategoryFilterProps {
  categories: string[]
  selectedCategory: string
  onSelectCategory: (category: string) => void
}

function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryFilterProps) {
  // Using useTranslation hook to initialize i18n context
  useTranslation()

  return (
    <div className="category-filter">
      <button
        className={
          selectedCategory === 'all' ? 'filter-button active' : 'filter-button'
        }
        onClick={() => onSelectCategory('all')}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          className={
            selectedCategory === category
              ? 'filter-button active'
              : 'filter-button'
          }
          onClick={() => onSelectCategory(category)}
          style={{
            borderBottom: `3px solid ${
              CATEGORY_COLORS[category] || CATEGORY_COLORS._default
            }`
          }}
        >
          {category}
        </button>
      ))}
    </div>
  )
}

function App() {
  const { t } = useTranslation()
  const [nodes, setNodes] = useState<ProcessedNode[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isQueueRunning, setIsQueueRunning] = useState<boolean>(false)
  const [highlightedNode, setHighlightedNode] = useState<
    string | number | null
  >(null)

  // Get nodes from ComfyUI graph and organize them
  useEffect(() => {
    if (!window.app?.graph) return

    // Initial node collection
    collectNodes()

    // Function to collect nodes from the graph
    function collectNodes() {
      const graphNodes = window.app?.graph._nodes
      if (!graphNodes) return

      const currentNodes: ProcessedNode[] = []

      for (const node of graphNodes) {
        // Extract category from constructorData if available
        let category = ''
        if (node.constructor && 'nodeData' in node.constructor) {
          const nodeData = node.constructor.nodeData
          if (
            nodeData &&
            typeof nodeData === 'object' &&
            'category' in nodeData
          ) {
            category = nodeData.category as string
          }
        }

        currentNodes.push({
          id: node.id,
          title: node.title,
          type: node.type,
          category: category,
          inputs: node.inputs?.length || 0,
          outputs: node.outputs?.length || 0,
          pos: [...node.pos] as [number, number] // Clone position array
        })
      }

      setNodes(currentNodes)
    }

    // Listen for graph changes using the API (not graph directly)
    const handleGraphChanged = () => {
      collectNodes()
    }

    window.app?.api.addEventListener('graphChanged', handleGraphChanged)

    return () => {
      window.app?.api.removeEventListener('graphChanged', handleGraphChanged)
    }
  }, [])

  // Monitor queue status
  useEffect(() => {
    if (!window.app?.api) return

    const handleQueueStart = () => setIsQueueRunning(true)
    const handleQueueComplete = () => setIsQueueRunning(false)

    // Using the Event API with properly typed events
    window.app.api.addEventListener('execution_start', handleQueueStart)

    // Since 'execution_complete' is not directly in the types, we add a compatibility approach
    type ApiEventName = Parameters<typeof window.app.api.addEventListener>[0]
    window.app.api.addEventListener(
      'execution_complete' as ApiEventName,
      handleQueueComplete
    )

    return () => {
      window.app?.api.removeEventListener('execution_start', handleQueueStart)
      window.app?.api.removeEventListener(
        'execution_complete' as ApiEventName,
        handleQueueComplete
      )
    }
  }, [])

  // Handle node highlighting
  useEffect(() => {
    if (!highlightedNode || !window.app?.graph) return

    // Find the node in the graph
    const graphNodes = window.app.graph._nodes
    const node = graphNodes.find((n) => n.id === highlightedNode)
    if (!node) return

    // Center camera on node with smooth animation
    window.app.canvas.centerOnNode(node)

    // Highlight the node
    const originalColor = node.color
    node.color = '#ff5722'
    window.app.graph.setDirtyCanvas(true, false)

    // Reset highlight after a delay
    const timeout = setTimeout(() => {
      if (window.app?.graph._nodes.includes(node)) {
        node.color = originalColor
        window.app.graph.setDirtyCanvas(true, false)
      }
    }, 2000)

    return () => {
      clearTimeout(timeout)
      // Restore original color if component unmounts
      if (window.app?.graph._nodes.includes(node)) {
        node.color = originalColor
        window.app.graph.setDirtyCanvas(true, false)
      }
    }
  }, [highlightedNode])

  // Calculate statistics from nodes
  const { filteredNodes, categories, nodeCounts, totalNodes } = useMemo(() => {
    // Get filtered nodes based on selected category
    const filtered =
      selectedCategory === 'all'
        ? nodes
        : nodes.filter((node) => node.category === selectedCategory)

    // Get unique categories
    const uniqueCategories = [
      ...new Set(nodes.map((node) => node.category))
    ].sort()

    // Count nodes by category
    const counts = nodes.reduce((acc: Record<string, number>, node) => {
      const category = node.category
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {})

    return {
      filteredNodes: filtered,
      categories: uniqueCategories,
      nodeCounts: counts,
      totalNodes: nodes.length
    }
  }, [nodes, selectedCategory])

  return (
    <div className="react-example-container">
      <h2>{t('app.title')}</h2>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-value">{totalNodes}</div>
          <div className="stat-label">{t('app.nodeStats.totalNodes')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{categories.length}</div>
          <div className="stat-label">{t('app.nodeStats.uniqueNodeTypes')}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{isQueueRunning ? 'Active' : 'Idle'}</div>
          <div className="stat-label">Queue Status</div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Node Type Distribution</h3>
        {totalNodes > 0 ? (
          <NodeStatsChart nodeCounts={nodeCounts} totalNodes={totalNodes} />
        ) : (
          <div className="empty-state">{t('app.noNodes')}</div>
        )}
      </div>

      <div className="dashboard-section">
        <h3>{t('app.nodeList.title')}</h3>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="node-list">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) => (
              <div
                key={node.id}
                className="node-item"
                onClick={() => setHighlightedNode(node.id)}
              >
                <div
                  className="node-badge"
                  style={{
                    backgroundColor:
                      CATEGORY_COLORS[node.category] || CATEGORY_COLORS._default
                  }}
                ></div>
                <div className="node-title">{node.title}</div>
                <div className="node-meta">
                  <span>
                    {t('app.nodeList.inputs')}: {node.inputs}
                  </span>
                  <span>
                    {t('app.nodeList.outputs')}: {node.outputs}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              {totalNodes === 0
                ? t('app.noNodes')
                : 'No nodes match the selected filter'}
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: '20px' }}>
        <h3>API Examples</h3>
        <div
          className="api-examples"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}
        >
          <h4>Dialog API</h4>
          <button
            className="dialog-btn"
            onClick={() => {
              // Dialog API Example - Prompt
              void window.app?.extensionManager.dialog
                .prompt({
                  title: 'Dialog API Demo',
                  message:
                    'This is a prompt dialog example. Please enter something:',
                  defaultValue: 'Dialog API is great!'
                })
                .then((result) => {
                  if (result !== null) {
                    alert(`You entered: ${result}`)
                  }
                })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Prompt Dialog
          </button>

          <button
            className="dialog-btn"
            onClick={() => {
              // Dialog API Example - Confirm
              void window.app?.extensionManager.dialog
                .confirm({
                  title: 'Confirm Action',
                  message: 'This is a confirmation dialog example.',
                  type: 'default'
                })
                .then((result) => {
                  alert(result ? 'You confirmed!' : 'You cancelled!')
                })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Confirm Dialog
          </button>

          <h4>Toast API</h4>
          <button
            className="toast-btn"
            onClick={() => {
              // Toast API Example - Info
              window.app?.extensionManager.toast.add({
                severity: 'info',
                summary: 'Information',
                detail: 'This is an info toast message',
                life: 3000
              })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Info Toast
          </button>

          <button
            className="toast-btn"
            onClick={() => {
              // Toast API Example - Success
              window.app?.extensionManager.toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Operation completed successfully!',
                life: 3000
              })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Success Toast
          </button>

          <button
            className="toast-btn"
            onClick={() => {
              // Toast API Example - Warning
              window.app?.extensionManager.toast.add({
                severity: 'warn',
                summary: 'Warning',
                detail: 'This action may cause issues!',
                life: 5000
              })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Warning Toast
          </button>

          <button
            className="toast-btn"
            onClick={() => {
              // Toast API Example - Error
              window.app?.extensionManager.toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Something went wrong!',
                life: 5000
              })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#F44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Error Toast
          </button>

          <button
            className="toast-btn"
            onClick={() => {
              // Toast API Example - Alert alternative using regular toast
              window.app?.extensionManager.toast.add({
                severity: 'info',
                summary: 'Alert',
                detail: 'This is an alert message!',
                life: 3000
              })
            }}
            style={{
              padding: '8px 12px',
              backgroundColor: '#673AB7',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              margin: '5px'
            }}
          >
            Show Alert Toast
          </button>
        </div>
      </div>

      <div className="footer">
        <p>{t('app.footer.clickToHighlight')}</p>
      </div>
    </div>
  )
}

export default App
