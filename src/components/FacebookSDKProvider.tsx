'use client';

import dynamic from 'next/dynamic';

// Dynamically import the Facebook SDK component with no SSR
const FacebookSDK = dynamic(() => import('@/components/FacebookSDK'), { ssr: false });

export function FacebookSDKProvider() {
  return <FacebookSDK />;
} 