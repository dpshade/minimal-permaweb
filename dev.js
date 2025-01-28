const server = Bun.serve({
    port: 3000,
    fetch(req) {
        const url = new URL(req.url);
        
        // Serve index.html for root
        if (url.pathname === '/') {
            return new Response(Bun.file('./index.html'));
        }

        // Handle favicon
        if (url.pathname === '/favicon.ico') {
            return new Response(null, { status: 204 });
        }

        // Serve static files from dist directory
        if (url.pathname.startsWith('/dist/')) {
            const file = Bun.file(`.${url.pathname}`);
            return file.exists() 
                ? new Response(file) 
                : new Response('Not found', { status: 404 });
        }

        // Default to 404
        return new Response('Not found', { status: 404 });
    },
});

console.log(`Server running at http://localhost:${server.port}`);
