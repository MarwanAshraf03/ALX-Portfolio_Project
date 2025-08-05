const API_BASE_URL = 'http://localhost:3000'; // Update this to your backend URL

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('sessionToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options,
      });
      
      const data = await response.json();
      return { success: response.ok, data };
    } catch (error) {
      return { success: false, message: 'Network error' };
    }
  }

  // Auth endpoints
  async signIn(userData: {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string;
  }) {
    return this.request('/sign_in', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logIn(credentials: { email: string; password: string }) {
    const response = await this.request<{ sessionId: string }>('/log_in', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data?.sessionId) {
      localStorage.setItem('sessionToken', response.data.sessionId);
    }
    
    return response;
  }

  async logOut() {
    const response = await this.request('/log_out', { method: 'POST' });
    localStorage.removeItem('sessionToken');
    return response;
  }

  // Auction endpoints
  async createAuction(auctionData: {
    title: string;
    startingPrice: number;
    endDate: string;
    bidIncrement: number;
    startDate?: string;
    imageUrl?: string;
    description?: string;
    createdBy?: string;
    status?: string;
  }) {
    return this.request('/create_auction', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  }

  async updateAuction(auctionData: {
    createdBy: string;
    title: string;
    endDate?: string;
    imageUrl?: string;
    description?: string;
  }) {
    return this.request('/update_auction', {
      method: 'POST',
      body: JSON.stringify(auctionData),
    });
  }

  async getAuctions(status?: string) {
    const body = status ? JSON.stringify({ status }) : undefined;
    return this.request('/auction_list', {
      method: 'GET',
      ...(body && { body }),
    });
  }

  async placeBid(auctionId: string) {
    return this.request('/bid', {
      method: 'POST',
      body: JSON.stringify({ auctionId }),
    });
  }

  isAuthenticated() {
    return !!localStorage.getItem('sessionToken');
  }
}

export const apiService = new ApiService();