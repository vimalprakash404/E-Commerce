const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getAuthHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/user/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials, userType = 'customer') {
    const response = await this.request(`/user/auth/login/${userType}`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async logout() {
    const response = await this.request('/user/auth/logout', {
      method: 'POST',
    });
    this.setAuthToken(null);
    return response;
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/product${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id) {
    return this.request(`/product/${id}`);
  }

  async createProduct(productData) {
    return this.request('/product', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/product/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/product/${id}`, {
      method: 'DELETE',
    });
  }

  // Cart endpoints
  async getCart() {
    const response = await this.request('/cart');
    return response || { items: [] };
  }

  async addToCart(productId, quantity = 1) {
    return this.request('/cart/add', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  }

  async removeFromCart(productId) {
    return this.request('/cart/remove', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    });
  }

  async clearCart() {
    return this.request('/cart/clear', {
      method: 'POST',
    });
  }

  // Order endpoints
  async placeOrder(orderData) {
    return this.request('/order/', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getUserOrders() {
    const response = await this.request('/order/users');
    return response || [];
  }

  async getAllOrders() {
    return this.request('/order/admin');
  }

  async updateOrderStatus(orderId, status) {
    return this.request(`/order/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Admin product endpoints
  async createProduct(formData) {
    return this.request('/product', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        // Don't set Content-Type for FormData
      },
    });
  }

  async updateProduct(id, formData) {
    return this.request(`/product/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        // Don't set Content-Type for FormData
      },
    });
  }
}

export default new ApiService();