import { PdfFusionClient } from '@/components/pdf-fusion/pdf-fusion-client';

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-slate-50 dark:bg-slate-900/95 py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-gray-900 dark:text-white font-headline">
          PDF<span className="text-primary">usion</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-4 md:text-xl md:max-w-3xl dark:text-gray-400">
          Drag, drop, and merge. Create your perfect PDF in seconds.
        </p>
      </div>
      <PdfFusionClient />
    </main>
  );
}
