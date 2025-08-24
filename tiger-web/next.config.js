/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "connect-src 'self' http://localhost:3001 https://localhost:3001"
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
