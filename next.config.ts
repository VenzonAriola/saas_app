import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here
  * images authorized clerk profile to show as if we are talking to vapi */


    images:{
        remotePatterns:[
            {hostname:'img.clerk.com'}
        ]
    }
};

export default nextConfig;
