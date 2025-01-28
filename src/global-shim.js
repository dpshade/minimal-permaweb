// Polyfill global object for browser environment
if (typeof window !== 'undefined') {
    // Global object
    window.global = window;
    
    // Process
    window.process = window.process || { 
        env: {},
        nextTick: (fn) => Promise.resolve().then(fn)
    };
    
    // Timers
    window.setImmediate = window.setImmediate || ((fn, ...args) => setTimeout(fn, 0, ...args));
    window.clearImmediate = window.clearImmediate || ((id) => clearTimeout(id));
    
    // Buffer
    window.Buffer = window.Buffer || require('buffer').Buffer;
    
    // Stream requirements
    window.process.browser = true;
    window.process.version = ''; // Needed by some stream operations
    window.process.versions = { node: '' };
}
