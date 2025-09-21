
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book, BookBorrower, BookFormData } from '../models/book';
import { ApiResponse } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly API_URL = 'http://localhost:8080/api/books';
  private readonly API_ADMIN='http://localhost:8080/api/admin';
  constructor(private http: HttpClient) {}
  getBooks(page: number = 0, size: number = 10, search?: string): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ApiResponse<any>>(`${this.API_ADMIN}/books`,);
  }
  
  getBookById(id: string): Observable<Book> {
    return this.http.get<Book>(`${this.API_URL}/${id}`);
  }

  addBook(bookData: BookFormData): Observable<Book> {
    return this.http.post<Book>(`${this.API_ADMIN}/books/add`, bookData);
  }

  updateBook(id: string, bookData: BookFormData): Observable<Book> {
    return this.http.put<Book>(`${this.API_ADMIN}/${id}`, bookData);
  }

  deleteBook(id: string): Observable<ApiResponse<any>> {
    return this.http.delete<ApiResponse<any>>(`${this.API_ADMIN}/${id}`);
  }

  getBookBorrowers(bookId: string): Observable<BookBorrower[]> {
    return this.http.get<BookBorrower[]>(`${this.API_URL}/${bookId}/borrowers`);
  }

  searchBooksRealTime(searchTerm:string, searchType:string='all'):Observable<any>{
    const params=new HttpParams()
    .set('searchTerm',searchTerm)
    .set('searchType',searchType);
    return this.http.get(`${this.API_URL}/search`,{params});
  }

  searchBooks(searchTerm: string, searchType: 'title' | 'author' | 'category'): Observable<Book[]> {
    const params = new HttpParams().set('searchTerm', searchTerm);
    return this.http.get<Book[]>(`${this.API_URL}/search`, { params });
  }

  getBookCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }
}
