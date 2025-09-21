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
            <span className={`text-sm text-foreground`}>
              ({result.statusText})
            </span>
          </div>
          <div className={`flex items-center gap-2 text-sm text-foreground`}>
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
        <h4 className={`font-medium mb-2 text-foreground`}>Executed URL</h4>
        <div className="bg-background/50 rounded-lg p-3 border border-white/10">
          <code className={`text-sm font-mono break-all text-foreground`}>{result.url}</code>
        </div>
      </div>

      <div className="bg-background/30 rounded-lg p-4 border border-white/10 dark:bg-black/20 dark:border-white/10">
        <h4 className={`font-medium mb-2 text-foreground`}>Response</h4>
        {(() => {
          const responseData = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
          
          // Check if response is HTML - more robust detection
          const isHTML = (() => {
            const trimmed = responseData.trim().toLowerCase();
            return (
              trimmed.startsWith('<') && (
                trimmed.includes('<html') ||
                trimmed.includes('<body') ||
                trimmed.includes('<!doctype') ||
                trimmed.includes('<div') ||
                trimmed.includes('<p') ||
                trimmed.includes('<h1') ||
                trimmed.includes('<title')
              )
            ) ||
            // Also check for common HTML error patterns
            trimmed.includes('</html>') ||
            (trimmed.includes('<head>') && trimmed.includes('<body>'));
          })();
          
          // Check if response is JSON
          const isJSON = (() => {
            if (typeof result.data === 'object' && result.data !== null) return true;
            if (typeof result.data !== 'string') return false;
            try {
              JSON.parse(result.data);
              return true;
            } catch {
              return false;
            }
          })();

          if (isHTML) {
            return (
              <div className="space-y-2">
                <p className={`text-xs text-foreground`}>HTML Response</p>
                <iframe
                  srcDoc={responseData}
                  className="w-full h-64 border border-white/20 rounded bg-white"
                  title="HTML Response"
                  sandbox="allow-same-origin"
                />
              </div>
            );
          } else if (isJSON && typeof result.data !== 'string') {
            return (
              <div className="space-y-2">
                <p className={`text-xs text-foreground`}>JSON Response</p>
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap bg-background/50 p-3 rounded border border-white/10">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            );
          } else {
            return (
              <div className="space-y-2">
                <p className={`text-xs text-foreground`}>Text Response</p>
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap bg-background/50 p-3 rounded border border-white/10">
                  {responseData}
                </pre>
              </div>
            );
          }
        })()}
      </div>
    </motion.div>
  );
}