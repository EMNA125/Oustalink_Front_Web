import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  _id?: string;
  title: string;
  service_types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:5000/categories';

  constructor(private http: HttpClient) {}

  // Create a category
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/create`, category);
  }

  // Get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/`);
  }

  // Get category by ID
  getCategoryById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Update category
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  // Delete category
  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Get categories by title
  getCategoriesByTitle(title: string): Observable<Category[]> {
    const params = new HttpParams().set('title', title);
    return this.http.get<Category[]>(`${this.apiUrl}/search/title`, { params });
  }

  // Filter categories with custom filters
  filterCategories(filters: any): Observable<Category[]> {
    let params = new HttpParams();
    for (const key in filters) {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    }
    return this.http.get<Category[]>(`${this.apiUrl}/filter`, { params });
  }

  // Get categories by service type
  getCategoriesByServiceType(serviceType: string): Observable<Category[]> {
    const params = new HttpParams().set('serviceType', serviceType);
    return this.http.get<Category[]>(`${this.apiUrl}/service-type`, { params });
  }
}
