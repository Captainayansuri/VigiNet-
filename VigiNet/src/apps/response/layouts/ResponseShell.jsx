import React from 'react';
import ResponseSidebar from '../components/ResponseSidebar';
import ResponseTopBar from '../components/ResponseTopBar';

export default function ResponseShell({ children }) {
  return (
    <div className="min-h-screen bg-[#04060b] text-slate-100 bg-grid-pattern">
      <ResponseTopBar />
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-[1600px]">
        <ResponseSidebar />
        <main className="min-w-0 flex-1 px-3 py-4 sm:px-5 lg:px-6 lg:py-6">{children}</main>
      </div>
    </div>
  );
}
