// WalletManager.js
import { createDataItemSigner } from '@permaweb/aoconnect';

export class WalletManager {
  constructor() {
    this.walletAddress = null;
    this.authMethod = null;
    this.signer = null;
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    this.modal = null;
    this.initModal();
  }

  initModal() {
    this.modal = document.createElement('div');
    this.modal.className = 'wallet-modal';
    this.modal.style.display = 'none';
    
    const style = document.createElement('style');
    style.textContent = `
      @import url('/public/fonts/matrix.css');

      body {
        font-family: 'MatrixFont', monospace;
        margin: 0;
        padding: 0;
        background: #fafafa;
      }

      .main-heading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 4rem;
        font-weight: bold;
        color: #1a1a1a;
        text-align: center;
        font-family: 'MatrixFont', monospace;
        margin: 0;
        letter-spacing: 0.1em;
      }

      .wallet-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
        -webkit-backdrop-filter: blur(5px);
        font-family: 'MatrixFont', monospace;
      }

      .modal-content {
        background: white;
        padding: 1.75rem;
        border-radius: 16px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        animation: modalFade 0.3s ease-out;
      }

      @keyframes modalFade {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .modal-header {
        margin-bottom: 1.5rem;
      }

      .modal-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: #1a1a1a;
        margin: 0;
        font-family: 'MatrixFont', monospace;
      }

      .modal-subtitle {
        color: #666;
        margin: 0.5rem 0 0 0;
        font-size: 0.9rem;
        font-family: 'MatrixFont', monospace;
      }

      .connect-options {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .connect-option {
        display: flex;
        align-items: center;
        padding: 1rem;
        border: 2px solid #eef0f2;
        border-radius: 16px;
        cursor: pointer;
        transition: all 0.2s ease;
        background: white;
      }

      .connect-option:hover:not(.disabled) {
        background: #f8f9fa;
        border-color: #e2e4e8;
        transform: translateY(-1px);
      }

      .connect-option.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        background: #f8f9fa;
      }

      .connect-option-icon {
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background-size: 32px;
        background-position: center;
        background-repeat: no-repeat;
        margin-right: 1rem;
        flex-shrink: 0;
      }

      .connect-option-detail {
        flex: 1;
      }

      .connect-option-name {
        font-weight: 600;
        margin: 0;
        color: #1a1a1a;
        font-size: 1rem;
        font-family: 'MatrixFont', monospace;
      }

      .connect-option-desc {
        margin: 0.25rem 0 0 0;
        font-size: 0.875rem;
        color: #666;
        line-height: 1.4;
        font-family: 'MatrixFont', monospace;
      }

      #wallet-button {
        position: fixed;
        top: 1rem;
        right: 1rem;
        padding: 0.5rem 0.875rem;
        border-radius: 8px;
        border: none;
        font-size: 0.75rem;
        font-weight: 500;
        font-family: 'MatrixFont', monospace;
        cursor: pointer;
        transition: all 0.2s ease;
        background: #4444ff;
        color: white;
        box-shadow: 0 2px 5px rgba(68, 68, 255, 0.2);
        z-index: 100;
      }

      #wallet-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(68, 68, 255, 0.3);
      }

      #wallet-button.connected {
        background: #ff4444;
        box-shadow: 0 2px 5px rgba(255, 68, 68, 0.2);
      }

      #wallet-button.connected:hover {
        box-shadow: 0 4px 8px rgba(255, 68, 68, 0.3);
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(this.modal);
  }

  getTemplate() {
    const options = [
      {
        id: "arconnectOption",
        html: `
          <div id="arconnectOption" class="connect-option ${this.isMobile ? "disabled" : ""}">
            <div class="connect-option-icon" style="background-image: url('https://arweave.net/tQUcL4wlNj_NED2VjUGUhfCTJ6pDN9P0e3CbnHo3vUE'); background-color: rgb(171, 154, 255);"></div>
            <div class="connect-option-detail">
              <p class="connect-option-name">ArConnect</p>
              <p class="connect-option-desc">${this.isMobile ? "Mobile support coming soon..." : "Secure, non-custodial browser wallet for Arweave"}</p>
            </div>
          </div>
        `,
        disabled: this.isMobile,
      }
    ];

    return `
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Connect Wallet</h2>
          <p class="modal-subtitle">Choose your preferred wallet to connect to this dapp</p>
        </div>
        <div class="connect-options">
          ${options.map(opt => opt.html).join('')}
        </div>
      </div>
    `;
  }

  showModal() {
    this.modal.innerHTML = this.getTemplate();
    this.modal.style.display = 'flex';
    
    // Add click handlers
    const arconnectOption = document.getElementById('arconnectOption');
    if (arconnectOption && !this.isMobile) {
      arconnectOption.onclick = () => this.connectWallet('ArConnect');
    }

    // Close modal when clicking outside
    this.modal.onclick = (e) => {
      if (e.target === this.modal) {
        this.hideModal();
      }
    };
  }

  hideModal() {
    this.modal.style.display = 'none';
  }

  async tryArConnect() {
    try {
      if (!window.arweaveWallet) {
        throw new Error("ArConnect not installed");
      }

      await window.arweaveWallet.connect([
        "ACCESS_ADDRESS",
        "ACCESS_PUBLIC_KEY",
        "SIGN_TRANSACTION"
      ], {
        name: "Minimal AO",
      });

      this.walletAddress = await window.arweaveWallet.getActiveAddress();
      this.authMethod = "ArConnect";
    } catch (error) {
      console.warn("ArConnect connection failed:", error);
      throw error;
    }
  }

  async connectWallet(method) {
    try {
      switch (method) {
        case "ArConnect":
          await this.tryArConnect();
          break;
        default:
          throw new Error("Unsupported wallet method");
      }

      // Create signer based on auth method
      switch (this.authMethod) {
        case "ArConnect":
          this.signer = createDataItemSigner(window.arweaveWallet);
          break;
        default:
          throw new Error("No signer available for this auth method");
      }

      this.hideModal();
      this.updateConnectButton();
      return this.walletAddress;
    } catch (error) {
      if (error.message === "ArConnect not installed") {
        window.open('https://arconnect.io', '_blank');
      }
      console.error("Wallet connection failed:", error);
      throw error;
    }
  }

  async sendMessageToAO(tags, data = "", processId) {
    if (!this.signer) {
      throw new Error("Signer is not initialized. Please connect wallet first.");
    }

    try {
      console.log("Message sent to AO:", {
        ProcessId: processId,
        Tags: tags,
        Signer: this.signer
      });

      const messageId = await message({
        process: processId,
        tags,
        signer: this.signer,
        data: data,
      });

      console.log("Message ID:", messageId);
      
      // For read-only operations, use dryrun
      if (tags.some(tag => tag.name === "Action" && tag.value === "Read")) {
        const { Messages, Error } = await dryrun({
          process: processId,
          tags: tags,
          data: data,
          signer: this.signer,
        });
        
        if (Error) {
          console.error("Error in dry run:", Error);
          throw new Error(Error);
        }
        
        return { Messages, Error };
      }

      // For write operations, use result
      const { Messages, Error } = await result({
        process: processId,
        message: messageId,
        data: data,
      });

      if (Error) {
        console.error("Error in AO response:", Error);
        throw new Error(Error);
      }

      console.log("Messages:", Messages);
      console.log("AO action completed successfully");

      return { Messages, Error };
    } catch (error) {
      console.error("Error sending message to AO:", error);
      throw error;
    }
  }

  updateConnectButton() {
    const button = document.getElementById('wallet-button');
    if (!button) return;
    
    if (this.walletAddress) {
      button.textContent = `${this.walletAddress.slice(0, 6)}...${this.walletAddress.slice(-4)}`;
      button.onclick = () => this.disconnect();
      button.classList.add('connected');
    } else {
      button.textContent = 'Connect Wallet';
      button.onclick = () => this.showModal();
      button.classList.remove('connected');
    }
  }

  async disconnect() {
    try {
      if (this.authMethod === 'ArConnect' && window.arweaveWallet) {
        await window.arweaveWallet.disconnect();
      }
      this.walletAddress = null;
      this.authMethod = null;
      this.signer = null;
      this.updateConnectButton();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      throw error;
    }
  }
}

export default new WalletManager();
