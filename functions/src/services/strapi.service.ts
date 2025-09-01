import axios, { AxiosInstance } from 'axios';
import * as functions from 'firebase-functions';

export interface StrapiResource {
  id: number;
  attributes: {
    resourceKey: string;
    categoryKey: string;
    title: string;
    description: string;
    content: string;
    contentType: 'html' | 'markdown';
    locale: string;
    metadata?: {
      author?: string;
      publishDate?: string;
      tags?: string[];
    };
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      ogImage?: {
        data?: {
          attributes?: {
            url: string;
          };
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export class StrapiService {
  private api: AxiosInstance;
  private baseUrl: string;
  private apiToken: string;

  constructor() {
    // Firebase Functions config'den Strapi bilgilerini al
    this.baseUrl = functions.config().strapi?.base_url || 'http://localhost:1337';
    this.apiToken = functions.config().strapi?.api_token || '';

    this.api = axios.create({
      baseURL: `${this.baseUrl}/api`,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
  }

  /**
   * Tüm resource'ları getir
   */
  async getResources(locale: string = 'tr', category?: string): Promise<StrapiResource[]> {
    try {
      let url = `/resources?locale=${locale}&populate=*&pagination[limit]=100`;
      
      if (category) {
        url += `&filters[categoryKey][$eq]=${category}`;
      }
      
      const response = await this.api.get<StrapiResponse<StrapiResource[]>>(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching resources from Strapi:', error);
      throw new Error('Failed to fetch resources from Strapi');
    }
  }

  /**
   * Tek bir resource getir
   */
  async getResource(resourceKey: string, categoryKey: string, locale: string = 'tr'): Promise<StrapiResource | null> {
    try {
      const url = `/resources?locale=${locale}&populate=*` +
                  `&filters[resourceKey][$eq]=${resourceKey}` +
                  `&filters[categoryKey][$eq]=${categoryKey}`;
      
      const response = await this.api.get<StrapiResponse<StrapiResource[]>>(url);
      const resources = response.data.data || [];
      
      return resources.length > 0 ? resources[0] : null;
    } catch (error) {
      console.error('Error fetching resource from Strapi:', error);
      throw new Error('Failed to fetch resource from Strapi');
    }
  }

  /**
   * Resource'larda arama yap
   */
  async searchResources(query: string, locale: string = 'tr'): Promise<StrapiResource[]> {
    try {
      const url = `/resources?locale=${locale}&populate=*` +
                  `&filters[$or][0][title][$containsi]=${query}` +
                  `&filters[$or][1][description][$containsi]=${query}` +
                  `&filters[$or][2][content][$containsi]=${query}`;
      
      const response = await this.api.get<StrapiResponse<StrapiResource[]>>(url);
      return response.data.data || [];
    } catch (error) {
      console.error('Error searching resources in Strapi:', error);
      throw new Error('Failed to search resources in Strapi');
    }
  }

  /**
   * Kategorileri getir
   */
  async getCategories(locale: string = 'tr'): Promise<any[]> {
    try {
      // Strapi'de özel bir kategori endpoint'i varsa kullan
      // Yoksa resource'lardan unique kategorileri çıkar
      const resources = await this.getResources(locale);
      
      const categoriesMap = new Map<string, any>();
      
      resources.forEach(resource => {
        const categoryKey = resource.attributes.categoryKey;
        if (!categoriesMap.has(categoryKey)) {
          categoriesMap.set(categoryKey, {
            key: categoryKey,
            count: 1
          });
        } else {
          const cat = categoriesMap.get(categoryKey);
          cat.count++;
        }
      });
      
      return Array.from(categoriesMap.values());
    } catch (error) {
      console.error('Error fetching categories from Strapi:', error);
      throw new Error('Failed to fetch categories from Strapi');
    }
  }

  /**
   * Resource oluştur
   */
  async createResource(resource: Partial<StrapiResource['attributes']>): Promise<StrapiResource> {
    try {
      const response = await this.api.post<StrapiResponse<StrapiResource>>('/resources', {
        data: resource
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating resource in Strapi:', error);
      throw new Error('Failed to create resource in Strapi');
    }
  }

  /**
   * Resource güncelle
   */
  async updateResource(id: number, resource: Partial<StrapiResource['attributes']>): Promise<StrapiResource> {
    try {
      const response = await this.api.put<StrapiResponse<StrapiResource>>(`/resources/${id}`, {
        data: resource
      });
      return response.data.data;
    } catch (error) {
      console.error('Error updating resource in Strapi:', error);
      throw new Error('Failed to update resource in Strapi');
    }
  }

  /**
   * Resource sil
   */
  async deleteResource(id: number): Promise<void> {
    try {
      await this.api.delete(`/resources/${id}`);
    } catch (error) {
      console.error('Error deleting resource from Strapi:', error);
      throw new Error('Failed to delete resource from Strapi');
    }
  }

  /**
   * Medya yükle
   */
  async uploadMedia(file: Buffer, filename: string, mimeType: string): Promise<any> {
    try {
      const formData = new FormData();
      formData.append('files', new Blob([file], { type: mimeType }), filename);
      
      const response = await this.api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading media to Strapi:', error);
      throw new Error('Failed to upload media to Strapi');
    }
  }
}