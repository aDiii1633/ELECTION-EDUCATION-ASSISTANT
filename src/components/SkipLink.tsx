// components/SkipLink.tsx
'use client';

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed top-[-100px] left-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-2xl font-extrabold z-[9999] transition-all focus:top-4 shadow-2xl shadow-blue-200 outline-none ring-4 ring-blue-100 ring-offset-2"
    >
      Skip to Main Content
    </a>
  );
}
