'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    FB: any;
    fbAsyncInit?: () => void;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    // Load the Facebook SDK
    window.fbAsyncInit = function() {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: 'v18.0' // Use the latest version
      });
      
      window.FB.AppEvents.logPageView();
    };

    // Load the SDK asynchronously
    (function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      if (fjs && fjs.parentNode) {
        fjs.parentNode.insertBefore(js, fjs);
      }
    }(document, 'script', 'facebook-jssdk'));
    
    // Clean up
    return () => {
      if (window.fbAsyncInit) {
        window.fbAsyncInit = undefined;
      }
    };
  }, []);

  // This component doesn't render anything visible
  return null;
} 