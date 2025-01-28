// app.js
import walletManager from './wallet/WalletManager.js';
import { initHexocet } from './animation/hexocet.js';

export function initApp() {
    const app = document.getElementById('app');
    if (!app) return;

    // Create canvas for animation
    const canvas = document.createElement('canvas');
    canvas.id = 'hexocet';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        animation: pulse 3s infinite;
    `;

    // Create main heading
    const heading = document.createElement('h1');
    heading.className = 'main-heading';
    heading.textContent = 'PERMAWEB';
    
    // Create wallet button
    const button = document.createElement('button');
    button.id = 'wallet-button';
    button.textContent = 'Connect Wallet';
    button.onclick = () => walletManager.showModal();
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        body {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background: #fafafa;
        }

        .main-heading {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 4rem;
            font-weight: bold;
            color: #1a1a1a;
            text-align: center;
            z-index: 2;
            margin: 0;
            letter-spacing: 0.1em;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }

        @media (max-width: 768px) {
            .main-heading {
                font-size: 3rem;
            }
        }

        @media (max-width: 480px) {
            .main-heading {
                font-size: 2rem;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Append elements in correct order
    app.appendChild(canvas);
    app.appendChild(heading);
    app.appendChild(button);

    // Initialize hexocet animation
    initHexocet(canvas);
}
