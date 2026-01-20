import { PdfFusionClient } from '@/components/pdf-fusion/pdf-fusion-client';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative bg-gradient-to-br from-[#4F46E5] to-[#8B5CF6] dark:from-indigo-900 dark:to-violet-900">
       <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8 px-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
            PDFusion
          </h1>
          <p className="mt-3 max-w-md mx-auto text-indigo-100 sm:text-lg">
            Drag, drop, and merge. Create your perfect PDF in seconds.
          </p>
        </div>
        <PdfFusionClient />
      </div>
    </main>
  );
}
