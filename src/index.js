// Ensure global is defined first
if (typeof window !== 'undefined' && !window.global) {
    window.global = window;
}

// Import polyfills
import { Buffer } from 'buffer';
import crypto from 'crypto-browserify';
import path from 'path-browserify';
import process from 'process';

// Make polyfills available globally
if (typeof window !== 'undefined') {
    window.Buffer = Buffer;
    window.process = process;
    window.crypto = crypto;
    window.path = path;
    
    // Verify globals are set
    console.log('Global environment:', {
        hasGlobal: typeof global !== 'undefined',
        hasBuffer: typeof Buffer !== 'undefined',
        hasProcess: typeof process !== 'undefined',
        hasCrypto: typeof crypto !== 'undefined'
    });
}

// Initialize app
const app = document.getElementById('app');
if (app) {
    app.innerHTML = '<h1>Minimal AO Setup</h1>';
}