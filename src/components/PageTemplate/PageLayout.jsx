/**
 * Universal PageLayout component
 * Supports both single-column and two-column layouts
 * 
 * Two-column layout (when sidebar is provided):
 * - Left: Sidebar (3 cols) with filters
 * - Right: Content (9 cols) with main content
 * 
 * Single-column layout (when sidebar is not provided):
 * - Full width content
 */
export default function PageLayout({
  // Header component (recommended for most pages)
  header,
  
  // Main content component (required)
  content,
  
  // Sidebar component (optional - if provided, enables 2-column layout)
  sidebar,
  
  // Background styling
  backgroundGradient = "min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50",
  
  // Container styling
  containerClass = "p-6 space-y-6 max-w-7xl mx-auto",
  
  // Grid height for content area
  gridHeight = "h-[calc(100vh-280px)]",
}) {
  const hasSidebar = Boolean(sidebar)

  return (
    <div className={backgroundGradient}>
      <div className={containerClass}>
        {/* Header */}
        {header}

        {/* Content Grid */}
        {hasSidebar ? (
          // Two-column layout: Sidebar (3 cols) + Content (9 cols)
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${gridHeight}`}>
            <div className="lg:col-span-3">
              {sidebar}
            </div>
            <div className="lg:col-span-9">
              {content}
            </div>
          </div>
        ) : (
          // Single-column layout: Full width content
          <div className={gridHeight}>
            {content}
          </div>
        )}
      </div>
    </div>
  )
}
