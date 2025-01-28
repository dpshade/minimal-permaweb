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
        z-index: 0;
        animation: pulse 3s infinite;
    `;

    // Create main heading container
    const headingContainer = document.createElement('div');
    headingContainer.className = 'heading-container';

    // Create left side button
    const leftButton = document.createElement('button');
    leftButton.className = 'side-button left-button';
    leftButton.textContent = 'Say Hi to AO';
    leftButton.onclick = async () => {
        try {
            if (!walletManager.signer) {
                rightMessage.textContent = 'AO says: Connect wallet first!';
                await new Promise(resolve => setTimeout(resolve, 2000));
                walletManager.showModal();
                return;
            }

            // UI feedback
            rightMessage.innerHTML = '<div class="loading-dots">Connecting to AO<span>.</span><span>.</span><span>.</span></div>';
            leftButton.disabled = true;
            
            const tags = [
                { name: 'Action', value: 'Greeting' },
                { name: 'App-Name', value: 'Permaweb-App' },
                { name: 'App-Version', value: '0.1' },
                { name: 'Message', value: 'Hello AO!' }
            ];
            
            const processId = 'EY0SusejSTtv32VOCCxAfuuR83Jn8XoVRoU5uvJ6XAs';
            const { Messages, Error, messageId } = await walletManager.sendMessageToAO(tags, '', processId);

            if (Messages?.length) {
                const message = JSON.parse(Messages[0].Data);
                const timestamp = new Date(message.timestamp).toLocaleTimeString();
                
                rightMessage.innerHTML = `
                    <div class="message-container">
                        <div class="message-header">
                            <span class="message-time">${timestamp}</span>
                            <span class="message-status">✓</span>
                        </div>
                        <div class="message-body">
                            <div class="message-text">${message.greeting}</div>
                            <div class="message-meta" style="position: relative; z-index: 10;">
                                <span class="message-from">From: ${message.from.slice(0, 6)}...${message.from.slice(-4)}</span>
                                ${messageId ? `
                                    <a href="https://ao.link/#/message/${messageId}" 
                                       class="message-link" 
                                       target="_blank" 
                                       rel="noopener noreferrer"
                                       style="position: relative; z-index: 11;">
                                        View on AO
                                    </a>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('AO Communication Error:', error);
            rightMessage.innerHTML = `
                <div class="message-error">
                    <span class="error-icon">⚠️</span>
                    <span class="error-text">Connection failed</span>
                </div>
            `;
        } finally {
            leftButton.disabled = false;
        }
    };

    // Create main heading
    const heading = document.createElement('h1');
    heading.className = 'main-heading';
    heading.textContent = 'PERMAWEB';

    // Create right side message
    const rightMessage = document.createElement('div');
    rightMessage.className = 'side-message right-message';
    rightMessage.textContent = 'AO says: ...';

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

        .heading-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            gap: 2rem;
            z-index: 2;
            width: 90%;
            max-width: 1200px;
            justify-content: space-between;
            pointer-events: auto;
        }

        .main-heading {
            font-size: 4rem;
            font-weight: bold;
            color: #1a1a1a;
            text-align: center;
            margin: 0;
            letter-spacing: 0.1em;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .side-button {
            padding: 1rem 2rem;
            border: 1px solid #1a1a1a;
            font-family: 'MatrixFont', monospace;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 1rem;
            box-shadow: none;
            pointer-events: auto;
            background: rgba(255, 255, 255, 0.9);
        }

        .side-button:hover {
            transform: translateY(-0.5px);
            box-shadow: 0 4px 8px rgba(74, 26, 109, 0.1);
        }

        .side-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
        }

        .side-message {
            min-width: 280px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            padding: 1rem;
            background: rgba(255, 255, 255, 0.9);
            font-family: 'MatrixFont', monospace;
            color: #1a1a1a;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
            transition: opacity 0.3s ease;
        }

        .message-container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 12px;
            padding: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            transform: translateY(0);
            animation: messageSlide 0.3s ease-out;
        }

        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
            font-size: 0.8rem;
            color: #666;
        }

        .message-status {
            color: #4CAF50;
        }

        .message-body {
            text-align: left;
        }

        .message-text {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
        }

        .message-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.8rem;
            color: #666;
            margin-top: 0.5rem;
        }

        .message-from {
            background: rgba(101, 36, 148, 0.1);
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            font-family: monospace;
        }

        .message-link {
            color: #652494;
            text-decoration: none;
            padding: 0.2rem 0.5rem;
            border-radius: 4px;
            background: rgba(101, 36, 148, 0.1);
            transition: all 0.2s ease;
            font-size: 0.8rem;
        }

        .message-link:hover {
            background: rgba(101, 36, 148, 0.2);
            transform: translateY(-1px);
        }

        .message-error {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #d32f2f;
        }

        .loading-dots {
            display: inline-block;
        }

        .loading-dots span {
            animation: dots 1.5s infinite;
            opacity: 0;
        }

        .loading-dots span:nth-child(1) { animation-delay: 0.0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.3s; }
        .loading-dots span:nth-child(3) { animation-delay: 0.6s; }

        @keyframes dots {
            0% { opacity: 0; }
            50% { opacity: 1; }
            100% { opacity: 0; }
        }

        @keyframes pulse {
            0% { opacity: 0.8; }
            50% { opacity: 1; }
            100% { opacity: 0.8; }
        }

        @media (max-width: 1200px) {
            .heading-container {
                flex-direction: column;
                gap: 1rem;
            }

            .main-heading {
                font-size: 3rem;
            }

            .side-button, .side-message {
                font-size: 0.9rem;
                padding: 0.75rem 1.5rem;
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
    headingContainer.appendChild(leftButton);
    headingContainer.appendChild(heading);
    headingContainer.appendChild(rightMessage);
    
    app.appendChild(canvas);
    app.appendChild(headingContainer);
    app.appendChild(button);

    // Initialize hexocet animation
    initHexocet(canvas);
}
