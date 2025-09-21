'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { Endpoint } from '../lib/sampleData';

interface SwaggerImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (endpoints: Endpoint[]) => void;
}

export function SwaggerImportDialog({ isOpen, onClose, onImport }: SwaggerImportDialogProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'text'>('file');
  const [fileContent, setFileContent] = useState<string>('');
  const [textContent, setTextContent] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setFileContent(content);
      setError('');
    };
    reader.readAsText(file);
  };

  const parseSwaggerSpec = async (content: string): Promise<Endpoint[]> => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let spec: any;

      // Try to parse as JSON first
      try {
        spec = JSON.parse(content);
      } catch {
        // If JSON fails, try YAML parsing
        try {
          const YAML = await import('yaml');
          spec = YAML.parse(content);
        } catch {
          throw new Error('Please provide a valid JSON or YAML OpenAPI specification');
        }
      }

      if (!spec.openapi && !spec.swagger) {
        throw new Error('Invalid OpenAPI/Swagger specification. Missing "openapi" or "swagger" field.');
      }

      const endpoints: Endpoint[] = [];

      if (spec.paths) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          Object.entries(methods).forEach(([method, operation]: [string, any]) => {
            if (typeof operation === 'object' && operation !== null) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const parameters: any[] = [];

              // Add path parameters
              if (operation.parameters) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                operation.parameters.forEach((param: any) => {
                  parameters.push({
                    name: param.name,
                    in: param.in,
                    required: param.required || false,
                    type: param.schema?.type || 'string',
                    description: param.description,
                    example: param.example || param.schema?.example,
                  });
                });
              }

              // Add request body parameter
              if (operation.requestBody?.content) {
                const contentType = operation.requestBody.content['application/json'];
                if (contentType?.schema) {
                  parameters.push({
                    name: 'body',
                    in: 'body',
                    required: operation.requestBody.required || false,
                    type: 'object',
                    description: operation.requestBody.description || 'Request body',
                    example: contentType.schema.example || {},
                  });
                }
              }

              endpoints.push({
                method: method.toUpperCase(),
                url: spec.servers?.[0]?.url ? `${spec.servers[0].url}${path}` : `https://api.example.com${path}`,
                description: operation.summary || operation.description || `${method.toUpperCase()} ${path}`,
                group: operation.tags?.[0] || 'Imported',
                parameters: parameters.length > 0 ? parameters : undefined,
              });
            }
          });
        });
      }

      if (endpoints.length === 0) {
        throw new Error('No valid endpoints found in the specification');
      }

      return endpoints;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to parse specification');
    }
  };

  const handleImport = async () => {
    const content = activeTab === 'file' ? fileContent : textContent;

    if (!content.trim()) {
      setError('Please provide a Swagger/OpenAPI specification');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const endpoints = await parseSwaggerSpec(content);
      onImport(endpoints);
      onClose();
      // Reset form
      setFileContent('');
      setTextContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-4 md:inset-8 lg:inset-16 glass rounded-xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-foreground">Import Swagger/OpenAPI</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Tabs */}
              <div className="flex space-x-1 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('file')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'file' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  onClick={() => setActiveTab('text')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors ${
                    activeTab === 'text' ? 'bg-white/10 text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Paste Text
                </button>
              </div>

              {/* File Upload Tab */}
              {activeTab === 'file' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/30 transition-colors">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-foreground">Drop your OpenAPI file here</p>
                      <p className="text-sm text-muted-foreground">or click to browse</p>
                      <input
                        type="file"
                        accept=".json,.yaml,.yml"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="swagger-file"
                      />
                      <label
                        htmlFor="swagger-file"
                        className="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 cursor-pointer transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>
                  {fileContent && (
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">File loaded successfully</span>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Text Input Tab */}
              {activeTab === 'text' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <textarea
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    placeholder="Paste your OpenAPI/Swagger JSON or YAML specification here..."
                    className="w-full h-64 p-4 bg-background/50 border border-white/20 rounded-lg text-sm font-mono resize-none"
                  />
                  <p className="text-sm text-muted-foreground">
                    Supports both JSON and YAML OpenAPI/Swagger specifications.
                  </p>
                </motion.div>
              )}

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={isProcessing || (!fileContent && !textContent)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}