"use client";

import { useState, useEffect, useRef } from 'react';
import { PdfFusionClient } from '@/components/pdf-fusion/pdf-fusion-client';
import { ThemeToggle } from '@/components/theme-toggle';
import { Files } from 'lucide-react';
import { MergedDocuments } from '@/components/pdf-fusion/merged-documents';

export type MergedDocument = {
  id: string;
  name: string;
  url: string;
  timestamp: Date;
};

export default function Home() {
  const [mergedDocuments, setMergedDocuments] = useState<MergedDocument[]>([]);
  const isInitialMount = useRef(true);

  // Load from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedDocs = localStorage.getItem('mergedDocuments');
      if (storedDocs) {
        const parsedDocs = JSON.parse(storedDocs).map((doc: any) => ({
          ...doc,
          timestamp: new Date(doc.timestamp)
        }));
        setMergedDocuments(parsedDocs);
      }
    } catch (error) {
      console.error("Error reading from localStorage", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Save to localStorage whenever mergedDocuments changes, skipping the initial render
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem('mergedDocuments', JSON.stringify(mergedDocuments));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [mergedDocuments]);


  const handleMergeComplete = (mergedFile: { name: string; url: string }) => {
    const newDoc: MergedDocument = {
      ...mergedFile,
      id: `merged-${Date.now()}`,
      timestamp: new Date(),
    };
    setMergedDocuments((prevDocs) => [newDoc, ...prevDocs]);
  };

  const handleDeleteMerged = (id: string) => {
    setMergedDocuments((prevDocs) => prevDocs.filter((doc) => doc.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 md:px-8">
          <a href="/" className="flex items-center space-x-2">
            <Files className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">PD-Fuser</span>
          </a>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 w-full">
        <div className="container mx-auto max-w-4xl py-10 px-4 sm:px-6 md:px-8">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Seamless PDF & Image Merging
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground sm:text-lg">
              Drag, drop, and merge PDFs and images. Securely processed on your device.
            </p>
          </div>
          <div className="space-y-8">
            <PdfFusionClient onMergeComplete={handleMergeComplete} />
            <MergedDocuments
              documents={mergedDocuments}
              onDelete={handleDeleteMerged}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
