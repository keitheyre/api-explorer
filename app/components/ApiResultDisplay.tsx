'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { ApiResult } from './ApiEndpoint';

interface ApiResultDisplayProps {
  result: ApiResult | null;
}

export function ApiResultDisplay({ result }: ApiResultDisplayProps) {
  if (!result) return null;

  const isSuccess = result.status >= 200 && result.status < 300;
  const isError = result.error || !isSuccess;

  return (
    <motion.div
      className="glass rounded-xl p-6 mt-4"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {isSuccess ? (
          <CheckCircle className="w-5 h-5 text-green-400" />
        ) : (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm">Status: {result.status}</span>
            <span className="text-sm text-muted-foreground">({result.statusText})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{result.time}ms</span>
          </div>
        </div>
      </div>

      {result.error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Error</span>
          </div>
          <pre className="text-sm text-red-300 whitespace-pre-wrap">{result.error}</pre>
        </div>
      )}

      <div className="mb-4">
        <h4 className="font-medium mb-2">Executed URL</h4>
        <div className="bg-background/50 rounded-lg p-3 border border-white/10">
          <code className="text-sm text-foreground font-mono break-all">{result.url}</code>
        </div>
      </div>

      <div className="bg-black/20 rounded-lg p-4">
        <h4 className="font-medium mb-2">Response</h4>
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap">
          {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
        </pre>
      </div>
    </motion.div>
  );
}