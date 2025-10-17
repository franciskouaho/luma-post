'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileVideo, CheckCircle, AlertCircle } from 'lucide-react';

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      setUploadedFiles(prev => [...prev, ...videoFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const videoFiles = files.filter(file => file.type.startsWith('video/'));
      setUploadedFiles(prev => [...prev, ...videoFiles]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    setUploading(true);
    // Simuler l'upload
    await new Promise(resolve => setTimeout(resolve, 2000));
    setUploading(false);
    setUploadedFiles([]);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload de vidéos</h1>
        <p className="text-gray-600">
          Uploadez vos vidéos TikTok pour les planifier et les publier automatiquement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Upload className="h-5 w-5 mr-2" />
              Zone d'upload
            </CardTitle>
            <CardDescription>
              Glissez-déposez vos vidéos ou cliquez pour sélectionner
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileVideo className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                Glissez vos vidéos ici
              </p>
              <p className="text-sm text-gray-500 mb-4">
                ou cliquez pour sélectionner des fichiers
              </p>
              <input
                type="file"
                multiple
                accept="video/*"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <Button asChild>
                <label htmlFor="file-upload" className="cursor-pointer">
                  Sélectionner des fichiers
                </label>
              </Button>
              <p className="text-xs text-gray-400 mt-4">
                Formats supportés: MP4, MOV, AVI, WMV (max 200MB)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        <Card>
          <CardHeader>
            <CardTitle>Fichiers sélectionnés</CardTitle>
            <CardDescription>
              {uploadedFiles.length} fichier(s) sélectionné(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileVideo className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>Aucun fichier sélectionné</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <FileVideo className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Button */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="lg"
            className="min-w-[200px]"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Uploader {uploadedFiles.length} fichier(s)
              </>
            )}
          </Button>
        </div>
      )}

      {/* Recent Uploads */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Uploads récents</CardTitle>
          <CardDescription>
            Vos dernières vidéos uploadées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileVideo className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p>Aucun upload récent</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
