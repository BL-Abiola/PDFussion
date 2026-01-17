# **App Name**: PDFusion

## Core Features:

- PDF Upload via Drag and Drop: Allows users to upload multiple PDF files by dragging and dropping them into a designated area.
- File Queue Management: Enables users to view a list of uploaded files, including file names and sizes, and provides the ability to delete files from the queue.
- PDF Merge and Download: Uses `pdf-lib` to merge the uploaded PDF files (copying all pages without text extraction) into a single PDF document, which is then made available for download as a Blob URL.
- Reorder Files: Lets the user reorder files in the queue before merging to adjust the order in the final document

## Style Guidelines:

- Primary color: Deep Indigo to Violet gradient (#4F46E5) for a professional look.
- Secondary color: Emerald Green for success states.
- Accent color: Rose Red for errors/deletions.
- Background color: Soft gray (#F9FAFB) to provide a subtle backdrop.
- Font: 'Inter' sans-serif for high legibility and a strong contrast hierarchy.
- Glassmorphism card for the main UI, featuring soft shadows (`shadow-xl`, `shadow-2xl`) and rounded corners (`rounded-2xl`).
- Buttons: Active scale (press) effect on click.
- File list: Staggered entrance animations using Framer Motion's `AnimatePresence`.
- Progress bar: Smooth and animated progress updates.
- Hover states: Border color shifts and slight lift effects.
- Download state: Success animation (confetti or checkmark) upon completion.