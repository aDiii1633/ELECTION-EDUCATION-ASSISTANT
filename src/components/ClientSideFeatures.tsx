'use client';

import dynamic from 'next/dynamic';

const ChatWidget = dynamic(() => import('@/components/ChatWidget'), { ssr: false });
const AccessibilityController = dynamic(() => import('@/components/AccessibilityController'), { ssr: false });

export default function ClientSideFeatures() {
  return (
    <>
      <AccessibilityController />
      <ChatWidget />
    </>
  );
}
