import path from 'path';

export default {
    root: 'src/',              // The root directory for Vite, where your main files reside
    publicDir: '../public/',    // Updated public directory, where static assets like index.html and favicon.ico are placed
    base: './',                 // Ensures relative paths for assets, helpful when deploying to subdirectories
    build: {
      sourcemap: true,
      outDir: '../dist',        // Output directory for build files, placed outside 'src'
      emptyOutDir: true,        // Cleans the output directory before building
      rollupOptions: {
        main: path.resolve(__dirname, 'src/index.html'),
        // List your main component files here
        Airplane: path.resolve(__dirname, 'src/components/Airplane.js'),
        Pilot: path.resolve(__dirname, 'src/components/Pilot.js'),
        Sea: path.resolve(__dirname, 'src/components/Sea.js'),
      },
    },
    server: {
      port: 3000,               // Sets the development server to run on port 3000
      open: true,               // Automatically opens the browser on server start
    },
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, './src/assets'),       // Correct alias for assets directory
        '@components': path.resolve(__dirname, './src/components'),  // Correct alias for components directory
        '@utils': path.resolve(__dirname, './src/utils'), 
      },
    },
}