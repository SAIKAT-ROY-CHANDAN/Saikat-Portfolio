/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
        {protocol: 'https', hostname: 'i.ibb.co'},
        {protocol: 'https', hostname: 'img.freepik.com'},
        {protocol: 'https', hostname: 'i.ibb.co.com'},
        {protocol: 'https', hostname: 'static.licdn.com'},
        {protocol: 'https', hostname: 'media.licdn.com'},
        {protocol: 'https', hostname: '*.fna.fbcdn.net'},
        {protocol: 'https', hostname: 'lookaside.fbsbx.com'},
        {protocol: 'https', hostname: 'pbs.twimg.com'},
        {protocol: 'https', hostname: 'abs.twimg.com'},
    ]
  }  
};

export default nextConfig;
