export default {
    root: 'src/',              // The root directory for Vite, where your main files reside
    publicDir: '../public/',    // Updated public directory, where static assets like index.html and favicon.ico are placed
    base: './',                 // Ensures relative paths for assets, helpful when deploying to subdirectories
    build: {
      outDir: '../dist',        // Output directory for build files, placed outside 'src'
      emptyOutDir: true,        // Cleans the output directory before building
      rollupOptions: {
        input: '../public/index.html',  // Set entry point as 'public/index.html'
      },
    },
    server: {
      port: 3000,               // Sets the development server to run on port 3000
      open: true,               // Automatically opens the browser on server start
    },
    resolve: {
      alias: {
        '@assets': '/src/assets',      // Alias for assets directory
        '@components': '/src/components', // Alias for components directory
        '@utils': '/src/utils',    // Alias for helpers directory
      },
    },
}