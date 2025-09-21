'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';
import { Endpoint, Parameter } from '../lib/sampleData';
import { ApiResultDisplay } from './ApiResultDisplay';

interface ApiEndpointProps {
  endpoint: Endpoint;
}

export interface ApiResult {
  status: number;
  statusText: string;
  data: any;
  time: number;
  error?: string;
  url: string; // Add the actual URL used
}

export function ApiEndpoint({ endpoint }: ApiEndpointProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [paramValues, setParamValues] = useState<Record<string, any>>({});
  const [paramStrings, setParamStrings] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ApiResult | null>(null);

  const handleParamChange = (param: Parameter, value: any) => {
    setParamValues(prev => ({ ...prev, [param.name]: value }));
  };

  const handleParamStringChange = (param: Parameter, stringValue: string) => {
    setParamStrings(prev => ({ ...prev, [param.name]: stringValue }));
    
    // Try to parse JSON for body parameters
    if (param.in === 'body') {
      try {
        if (stringValue.trim() === '') {
          handleParamChange(param, undefined);
        } else {
          const parsed = JSON.parse(stringValue);
          handleParamChange(param, parsed);
        }
      } catch {
        // Invalid JSON, keep the string but don't update the parsed value
        // This allows the user to continue typing
      }
    }
  };

  const buildRequestUrl = () => {
    let url = endpoint.url;
    const queryParams: string[] = [];

    endpoint.parameters?.forEach(param => {
      const value = paramValues[param.name];
      if (value !== undefined && value !== '') {
        if (param.in === 'path') {
          url = url.replace(`{${param.name}}`, encodeURIComponent(value));
        } else if (param.in === 'query') {
          queryParams.push(`${param.name}=${encodeURIComponent(value)}`);
        }
      }
    });

    if (queryParams.length > 0) {
      url += (url.includes('?') ? '&' : '?') + queryParams.join('&');
    }

    return url;
  };

  const buildRequestBody = () => {
    const bodyParam = endpoint.parameters?.find(p => p.in === 'body');
    if (bodyParam && paramValues[bodyParam.name]) {
      return JSON.stringify(paramValues[bodyParam.name]);
    }
    return undefined;
  };

  const handleExecute = async () => {
    setIsLoading(true);
    const startTime = Date.now();

    try {
      const url = buildRequestUrl();
      const body = buildRequestBody();

      const response = await fetch(url, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      });

      const data = await response.text();
      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = data;
      }

      const time = Date.now() - startTime;
      const apiResult: ApiResult = {
        status: response.status,
        statusText: response.statusText,
        data: parsedData,
        time,
        url,
      };

      setResult(apiResult);
    } catch (error) {
      const time = Date.now() - startTime;
      const apiResult: ApiResult = {
        status: 0,
        statusText: 'Network Error',
        data: null,
        time,
        error: error instanceof Error ? error.message : 'Unknown error',
        url: buildRequestUrl(),
      };
      setResult(apiResult);
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET': return 'text-green-400';
      case 'POST': return 'text-blue-400';
      case 'PUT': return 'text-yellow-400';
      case 'DELETE': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const hasParameters = endpoint.parameters && endpoint.parameters.length > 0;

  return (
    <motion.div
      className="glass rounded-xl overflow-hidden"
      whileHover={{ y: -1 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Compact Header */}
      <div
        className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className={`font-mono font-bold text-sm px-2 py-1 rounded ${getMethodColor(endpoint.method)} bg-current/10 flex-shrink-0`}>
              {endpoint.method}
            </span>
            <span className="text-foreground font-mono text-sm truncate flex-1">{endpoint.url}</span>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-white/10"
          >
            <div className="p-4 space-y-4">
              {endpoint.description && (
                <p className="text-muted-foreground text-sm">{endpoint.description}</p>
              )}

              {hasParameters && (
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="font-semibold text-sm">Parameters</h4>
                  {endpoint.parameters?.map((param) => (
                    <div key={param.name} className="space-y-2">
                      <label className="block text-sm font-medium">
                        {param.name} {param.required && <span className="text-red-400">*</span>}
                        <span className="text-muted-foreground ml-2">({param.in})</span>
                      </label>
                      {param.description && (
                        <p className="text-xs text-muted-foreground">{param.description}</p>
                      )}
                      {param.in === 'body' ? (
                        <div className="space-y-2">
                          <textarea
                            className="w-full p-3 bg-background/50 border border-white/20 rounded-lg text-sm font-mono"
                            rows={4}
                            placeholder={param.example ? JSON.stringify(param.example, null, 2) : 'Enter JSON...'}
                            value={paramStrings[param.name] || (param.example ? JSON.stringify(param.example, null, 2) : '')}
                            onChange={(e) => handleParamStringChange(param, e.target.value)}
                          />
                          {paramStrings[param.name] && (
                            <div className="flex items-center gap-2 text-xs">
                              {(() => {
                                try {
                                  JSON.parse(paramStrings[param.name]);
                                  return (
                                    <span className="text-green-400 flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Valid JSON
                                    </span>
                                  );
                                } catch {
                                  return (
                                    <span className="text-red-400 flex items-center gap-1">
                                      <XCircle className="w-3 h-3" />
                                      Invalid JSON
                                    </span>
                                  );
                                }
                              })()}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type={param.type === 'integer' ? 'number' : 'text'}
                          className="w-full p-3 bg-background/50 border border-white/20 rounded-lg text-sm"
                          placeholder={param.example?.toString() || `Enter ${param.type}...`}
                          value={paramValues[param.name] || ''}
                          onChange={(e) => handleParamChange(param, param.type === 'integer' ? parseInt(e.target.value) : e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              <motion.button
                onClick={handleExecute}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 disabled:opacity-50 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {isLoading ? 'Executing...' : 'Execute'}
              </motion.button>

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <ApiResultDisplay result={result} />
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}