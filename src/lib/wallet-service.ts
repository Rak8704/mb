// lib/wallet-service.ts
// Cypress Gaming API Integration

const CYPRESS_API_URL = process.env.CYPRESS_API_URL || 'https://api.cqgame.games';
const CYPRESS_API_TOKEN = process.env.CYPRESS_API_TOKEN;

export interface WalletGetBalanceRequest {
  username: string;
  currency: string;
}

export interface WalletGetBalanceResponse {
  username: string;
  balance: number;
  currency: string;
  timestamp: number;
}

export interface WalletDebitRequest {
  username: string;
  amount: number;
  currency: string;
  gameId: string;
  transactionId: string;
  reference?: string;
}

export interface WalletCreditRequest {
  username: string;
  amount: number;
  currency: string;
  gameId: string;
  transactionId: string;
  reference?: string;
}

export interface WalletTransactionResponse {
  success: boolean;
  balance: number;
  transactionId: string;
  timestamp: number;
  message?: string;
}

class WalletService {
  private apiUrl: string;
  private apiToken: string;

  constructor() {
    this.apiUrl = CYPRESS_API_URL;
    this.apiToken = CYPRESS_API_TOKEN || '';
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiToken}`,
      'X-API-Token': this.apiToken,
    };
  }

  /**
   * Get player wallet balance
   */
  async getBalance(username: string, currency: string = 'INR'): Promise<WalletGetBalanceResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/wallet/balance`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          username,
          currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      throw error;
    }
  }

  /**
   * Debit from player wallet (withdraw from game)
   */
  async debit(request: WalletDebitRequest): Promise<WalletTransactionResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/wallet/debit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error debiting wallet:', error);
      throw error;
    }
  }

  /**
   * Credit to player wallet (deposit from game)
   */
  async credit(request: WalletCreditRequest): Promise<WalletTransactionResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/wallet/credit`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error crediting wallet:', error);
      throw error;
    }
  }

  /**
   * Verify wallet transaction callback
   */
  async verifyCallback(callbackData: any): Promise<boolean> {
    try {
      // Verify the callback token
      const receivedToken = callbackData.token || callbackData.wtoken;
      return receivedToken === process.env.WALLET_TOKEN;
    } catch (error) {
      console.error('Error verifying callback:', error);
      return false;
    }
  }
}

export const walletService = new WalletService();
