'use client'

import React, { useState } from 'react'
import { Download } from 'lucide-react'
import { Button } from '@hospitality-os/ui/src/components/Button'

interface ExportCsvButtonProps {
  data: any[]
  filename: string
}

export function ExportCsvButton({ data, filename }: ExportCsvButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleExport = () => {
    setLoading(true)
    try {
      if (!data || data.length === 0) {
        alert('No data to export')
        return
      }

      // Extract headers from the first object
      const headers = Object.keys(data[0])
      
      // Convert data to CSV format
      const csvRows = []
      csvRows.push(headers.join(',')) // Add headers row

      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header]
          // Escape quotes and wrap in quotes to handle commas in data
          const escaped = ('' + val).replace(/"/g, '""')
          return `"${escaped}"`
        })
        csvRows.push(values.join(','))
      }

      const csvString = csvRows.join('\n')
      
      // Create a Blob and trigger download
      const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Failed to export CSV')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      size="sm" 
      leftIcon={<Download size={16} />} 
      onClick={handleExport}
      isLoading={loading}
    >
      Export Report
    </Button>
  )
}
