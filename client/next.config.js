module.exports = {
  async rewrites() {
    return [
      { //This is for proxy to flask server from nextjs client, this will fix cors error;
        source: '/server/:path*',
        destination: 'http://localhost:8000/:path*',
      },
      { // here source /audio/:path* means starting with /audio/ should redirect to destination url given, and replace destination path with source path;
        source: '/audio/:path*',
        destination: 'http://localhost:8000/audio/:path*',
      },
    ];
  },

  // Disable compression for SSE
  compress: false,

  env: {
    env_var1: 'value here...',
  },

};




