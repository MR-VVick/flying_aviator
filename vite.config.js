import path from 'path';

export default {
    root: 'src/',              // The root directory for Vite, where your main files reside
    publicDir: '../public/',    // Updated public directory, where static assets like index.html and favicon.ico are placed
    base: './',                 // Ensures relative paths for assets, helpful when deploying to subdirectories
    build: {
      outDir: '../dist',        // Output directory for build files, placed outside 'src'
      emptyOutDir: true,        // Cleans the output directory before building
      rollupOptions: {
        input: '/index.html',  // Set entry point as 'public/index.html'
      },
    },
    server: {
      port: 3000,               // Sets the development server to run on port 3000
      open: true,               // Automatically opens the browser on server start
    },
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, 'src/assets'),       // Correct alias for assets directory
        '@components': path.resolve(__dirname, 'src/components'),  // Correct alias for components directory
        '@utils': path.resolve(__dirname, 'src/utils'), 
      },
    },
}