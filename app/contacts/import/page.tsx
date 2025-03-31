"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, FileText, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

export default function ImportContactsPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("upload")

  const { toast } = useToast()
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]

    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && selectedFile.type !== "application/vnd.ms-excel") {
        toast({
          title: "Formato no válido",
          description: "Por favor, selecciona un archivo CSV",
          variant: "destructive",
        })
        return
      }

      setFile(selectedFile)

      // Mostrar vista previa
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        const lines = text.split("\n")
        const headers = lines[0].split(",")

        const data = []
        for (let i = 1; i < Math.min(6, lines.length); i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(",")
            const row = {}
            headers.forEach((header, index) => {
              row[header.trim()] = values[index]?.trim() || ""
            })
            data.push(row)
          }
        }

        setPreviewData(data)
        setActiveTab("preview")
      }

      reader.readAsText(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Archivo requerido",
        description: "Por favor, selecciona un archivo CSV para importar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/contactos/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al importar contactos")
      }

      const data = await response.json()
      setResults(data.results)
      setActiveTab("results")

      toast({
        title: "Importación completada",
        description: `Se importaron ${data.results.imported} contactos exitosamente`,
      })
    } catch (error: any) {
      console.error("Error al importar contactos:", error)
      toast({
        title: "Error",
        description: error.message || "Error al importar contactos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setProgress(100)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Importar Contactos</h2>
          <p className="text-muted-foreground">Importa contactos desde un archivo CSV</p>
        </div>
        <Link href="/contacts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Contactos
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
          <TabsTrigger value="preview" disabled={!file}>
            Vista Previa
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!results}>
            Resultados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Subir Archivo CSV</CardTitle>
              <CardDescription>Selecciona un archivo CSV con tus contactos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Formato requerido</AlertTitle>
                <AlertDescription>
                  El archivo CSV debe tener las siguientes columnas: nombre, apellido, telefono, correo
                </AlertDescription>
              </Alert>

              <div className="flex justify-center p-6 border-2 border-dashed rounded-md">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Button variant="secondary">
                        <Upload className="mr-2 h-4 w-4" />
                        Seleccionar Archivo
                      </Button>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        onChange={handleFileChange}
                        disabled={isLoading}
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {file ? file.name : "Arrastra y suelta o haz clic para seleccionar"}
                  </p>
                </div>
              </div>

              {file && (
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("preview")}>Continuar</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Vista Previa</CardTitle>
              <CardDescription>Verifica que los datos sean correctos antes de importar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {previewData.length > 0 ? (
                <div className="border rounded-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {Object.keys(previewData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                      {previewData.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: any, i) => (
                            <td key={i} className="px-6 py-4 whitespace-nowrap text-sm">
                              {value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No hay datos para mostrar</p>
              )}

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("upload")}>
                  Volver
                </Button>
                <Button onClick={handleImport} disabled={isLoading}>
                  {isLoading ? "Importando..." : "Importar Contactos"}
                </Button>
              </div>

              {isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Progreso</span>
                    <span className="text-sm">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resultados de la Importación</CardTitle>
              <CardDescription>Resumen de la importación de contactos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results && (
                <div className="space-y-4">
                  <Alert
                    variant="default"
                    className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800"
                  >
                    <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertTitle>Importación completada</AlertTitle>
                    <AlertDescription>Se procesaron {results.total} registros del archivo</AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 dark:bg-green-900 p-4 rounded-md border border-green-200 dark:border-green-800">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{results.imported}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Contactos importados</p>
                    </div>
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-md border border-yellow-200 dark:border-yellow-800">
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{results.duplicates}</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Contactos duplicados</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900 p-4 rounded-md border border-red-200 dark:border-red-800">
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{results.errors}</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Errores</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Link href="/contacts">
                      <Button>Ir a Contactos</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

