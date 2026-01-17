import { PdfFusionClient } from '@/components/pdf-fusion/pdf-fusion-client';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-2 sm:p-6 relative">
       <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-3xl px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            PDFusion
          </h1>
          <p className="mt-3 max-w-md mx-auto text-muted-foreground sm:text-lg">
            Drag, drop, and merge. Create your perfect PDF in seconds.
          </p>
        </div>
        <PdfFusionClient />
      </div>
    </main>
  );
}
