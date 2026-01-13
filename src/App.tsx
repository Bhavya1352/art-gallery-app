import { useState, useEffect, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Card } from 'primereact/card'
import { Badge } from 'primereact/badge'

interface Artwork {
  id: number
  title: string
  place_of_origin: string
  artist_display: string
  inscriptions: string | null
  date_start: number
  date_end: number
}

interface ApiResponse {
  data: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
}

function App() {
  const [data, setData] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [selectCount, setSelectCount] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const overlayRef = useRef<OverlayPanel>(null)

  const rowsPerPage = 12 // API default

  useEffect(() => {
    fetchData(page)
  }, [page])

  const fetchData = async (pageNum: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNum}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result: ApiResponse = await response.json()
      setData(result.data)
      setTotalRecords(result.pagination.total)
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Failed to load artworks. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const selected = data.filter(item => selectedIds.has(item.id))

  const onSelectionChange = (e: { value: Artwork[] }) => {
    const newSelected = e.value
    const newIds = new Set(selectedIds)
    // Remove deselected
    data.forEach(item => {
      if (!newSelected.find(s => s.id === item.id)) {
        newIds.delete(item.id)
      }
    })
    // Add selected
    newSelected.forEach(item => {
      newIds.add(item.id)
    })
    setSelectedIds(newIds)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onPageChange = (e: any) => {
    setPage(e.page + 1) // PrimeReact pages are 0-based
  }

  const handleCustomSelect = () => {
    const count = parseInt(selectCount)
    if (!count || count <= 0 || count > data.length) {
      alert(`Please enter a valid number between 1 and ${data.length}`)
      return
    }
    const newIds = new Set(selectedIds)
    data.slice(0, count).forEach(item => newIds.add(item.id))
    setSelectedIds(newIds)
    overlayRef.current?.hide()
    setSelectCount('')
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const inscriptionsTemplate = (rowData: Artwork) => {
    return rowData.inscriptions || 'N/A'
  }

  const themeStyles = {
    backgroundColor: darkMode ? '#1a1a1a' : '#f8f9fa',
    color: darkMode ? '#ffffff' : '#2c3e50',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    transition: 'all 0.3s ease'
  }

  const cardStyles = {
    backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
    color: darkMode ? '#ffffff' : '#2c3e50',
    border: darkMode ? '1px solid #444' : '1px solid #e1e8ed'
  }

  return (
    <div style={themeStyles}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Card style={{ ...cardStyles, marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{ margin: 0, color: darkMode ? '#ffffff' : '#2c3e50' }}>Art Institute of Chicago Artworks</h1>
              <p style={{ margin: '5px 0', color: darkMode ? '#cccccc' : '#7f8c8d' }}>
                Browse and select artworks from our collection
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Button
                icon={darkMode ? 'pi pi-sun' : 'pi pi-moon'}
                onClick={toggleDarkMode}
                className="p-button-rounded p-button-outlined"
                tooltip={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                tooltipOptions={{ position: 'bottom' }}
              />
              <Badge value={selectedIds.size} severity="info" />
              <span>Selected</span>
              {selectedIds.size > 0 && (
                <Button 
                  label="Clear Selection" 
                  icon="pi pi-times" 
                  size="small" 
                  onClick={clearSelection}
                  className="p-button-outlined p-button-danger"
                />
              )}
            </div>
          </div>
        </Card>

        <Card style={cardStyles}>
          <div style={{ marginBottom: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              label="Custom Select"
              icon="pi pi-plus"
              onClick={(e) => overlayRef.current?.toggle(e)}
              className="p-button-outlined"
            />
            <OverlayPanel ref={overlayRef} style={{ 
              width: '300px',
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              color: darkMode ? '#ffffff' : '#2c3e50',
              border: darkMode ? '1px solid #444' : '1px solid #e1e8ed'
            }}>
              <div style={{ padding: '15px' }}>
                <h4 style={{ marginTop: 0, color: darkMode ? '#ffffff' : '#2c3e50' }}>Select First N Rows</h4>
                <p style={{ margin: '10px 0', color: darkMode ? '#cccccc' : '#666' }}>
                  Select the first N artworks from the current page (max: {data.length})
                </p>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <InputText
                    id="selectCount"
                    value={selectCount}
                    onChange={(e) => setSelectCount(e.target.value)}
                    placeholder="Enter number"
                    type="number"
                    min="1"
                    max={data.length.toString()}
                    style={{ 
                      flex: 1,
                      backgroundColor: darkMode ? '#3d3d3d' : '#ffffff',
                      color: darkMode ? '#ffffff' : '#2c3e50',
                      border: darkMode ? '1px solid #555' : '1px solid #ced4da'
                    }}
                  />
                  <Button label="Select" onClick={handleCustomSelect} />
                </div>
              </div>
            </OverlayPanel>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: darkMode ? '#3d1a1a' : '#fee', 
              color: darkMode ? '#ffaaaa' : '#c33', 
              padding: '10px', 
              borderRadius: '4px', 
              marginBottom: '15px',
              border: darkMode ? '1px solid #662222' : '1px solid #fcc'
            }}>
              {error}
              <Button 
                label="Retry" 
                icon="pi pi-refresh" 
                size="small" 
                onClick={() => fetchData(page)}
                style={{ marginLeft: '10px' }}
              />
            </div>
          )}

          <DataTable
            value={data}
            loading={loading}
            selectionMode="multiple"
            selection={selected}
            onSelectionChange={onSelectionChange}
            dataKey="id"
            paginator
            rows={rowsPerPage}
            totalRecords={totalRecords}
            lazy
            onPage={onPageChange}
            first={(page - 1) * rowsPerPage}
            responsiveLayout="scroll"
            emptyMessage="No artworks found."
            loadingIcon="pi pi-spin pi-spinner"
            style={{ 
              fontSize: '14px',
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
              color: darkMode ? '#ffffff' : '#2c3e50'
            }}
          >
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
            <Column field="title" header="Title" style={{ minWidth: '200px' }} />
            <Column field="place_of_origin" header="Place of Origin" style={{ minWidth: '150px' }} />
            <Column field="artist_display" header="Artist" style={{ minWidth: '200px' }} />
            <Column field="inscriptions" header="Inscriptions" body={inscriptionsTemplate} style={{ minWidth: '150px' }} />
            <Column field="date_start" header="Date Start" style={{ minWidth: '100px' }} />
            <Column field="date_end" header="Date End" style={{ minWidth: '100px' }} />
          </DataTable>
        </Card>
      </div>
    </div>
  )
}

export default App
