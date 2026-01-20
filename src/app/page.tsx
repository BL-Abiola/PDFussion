import { PdfFusionClient } from '@/components/pdf-fusion/pdf-fusion-client';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-gradient-to-br from-primary/20 to-primary/0 blur-3xl -z-0" />
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[60rem] h-[60rem] rounded-full bg-gradient-to-tl from-primary/20 to-primary/0 blur-3xl -z-0" />
      
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      <div className="w-full max-w-3xl z-10">
        <div className="text-center mb-8 px-4">
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
