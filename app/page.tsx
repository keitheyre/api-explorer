'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Zap, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { BackgroundBlobs } from './components/BackgroundBlobs';
import { ThemeToggle } from './components/ThemeToggle';
import { ApiEndpoint } from './components/ApiEndpoint';
import { SwaggerImportDialog } from './components/SwaggerImportDialog';
import { sampleEndpoints, Endpoint } from './lib/sampleData';
import { useTheme } from './components/ThemeProvider';

export default function Home() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const { theme } = useTheme();

  const handleLoadSample = () => {
    setEndpoints(sampleEndpoints);
    setExpandedGroups(new Set()); // Collapse all groups
  };

  const handleImportSwagger = (importedEndpoints: Endpoint[]) => {
    setEndpoints(importedEndpoints);
    setExpandedGroups(new Set()); // Collapse all groups
  };

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(group)) {
        newSet.delete(group);
      } else {
        newSet.add(group);
      }
      return newSet;
    });
  };

  const groupedEndpoints = endpoints.reduce((acc, endpoint) => {
    if (!acc[endpoint.group]) {
      acc[endpoint.group] = [];
    }
    acc[endpoint.group].push(endpoint);
    return acc;
  }, {} as Record<string, Endpoint[]>);

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      <BackgroundBlobs />
      <ThemeToggle />

      <div className="container mx-auto px-4 py-8">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            API Explorer
          </h1>
          <p className={`text-lg text-foreground max-w-2xl mx-auto`}>
            Test and explore API endpoints with glass morphism design
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center gap-4 mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.button
            onClick={handleLoadSample}
            className={`flex items-center gap-3 px-6 py-3 glass rounded-xl hover:scale-105 transition-all duration-300 text-foreground`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-5 h-5" />
            Load Sample API
          </motion.button>

          <motion.button
            onClick={() => setIsImportDialogOpen(true)}
            className={`flex items-center gap-3 px-6 py-3 glass rounded-xl hover:scale-105 transition-all duration-300 text-foreground`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FileText className="w-5 h-5" />
            Import Swagger
          </motion.button>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {Object.keys(groupedEndpoints).length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Zap className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground">
                Click "Load Sample API" or "Import Swagger" to get started with API endpoints
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className={`text-2xl font-semibold mb-6 text-foreground`}>Endpoints</h2>
              {Object.entries(groupedEndpoints).map(([group, groupEndpoints]) => (
                <motion.div
                  key={group}
                  className="mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="glass rounded-xl overflow-hidden">
                    <motion.button
                      onClick={() => toggleGroup(group)}
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                      whileHover={{ scale: 1.01 }}
                    >
                      <h3 className={`text-xl font-semibold text-foreground`}>{group}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm text-foreground`}>
                          {groupEndpoints.length} endpoint{groupEndpoints.length !== 1 ? 's' : ''}
                        </span>
                        {expandedGroups.has(group) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedGroups.has(group) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-white/10 dark:border-white/10"
                        >
                          <div className="p-4 space-y-4">
                            {groupEndpoints.map((endpoint, index) => (
                              <div key={`${endpoint.method}-${endpoint.url}-${index}`} className="w-full">
                                <ApiEndpoint
                                  endpoint={endpoint}
                                />
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <SwaggerImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={handleImportSwagger}
      />
    </div>
  );
}
