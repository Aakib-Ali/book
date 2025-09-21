import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/complaint';
import { Complaint } from '../models/complaint';
import { ComplaintUpdate } from '../models/complaint';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {
  private readonly API_URL = 'http://localhost:8080/api/complaints';

  constructor(private http: HttpClient) {}

  getComplaints(page: number, size: number, filters?: { [key: string]: any }): Observable<ApiResponse<any>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<ApiResponse<any>>(`${this.API_URL}`, { params });
  }


  getComplaintsByStatus(status: string, page: number = 0, size: number = 10): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/status/${status}`, { params });
  }

  getComplaintsByMember(memberId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/member/${memberId}`);
  }

  getComplaintById(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/${id}`);
  }

  fileComplaint(complaintRequest: any): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}`, complaintRequest);
  }

  updateComplaintStatus(complaintUpdate: ComplaintUpdate): Observable<Complaint> {
    return this.http.put<Complaint>(`${this.API_URL}/${complaintUpdate.complaintId}/status`, complaintUpdate);
  }

  addResponse(id: string, responseText: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/${id}/response`, {
      responseText,
      isFromAdmin: true
    });
  }

  getComplaintResponses(id: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/${id}/responses`);
  }

  getPendingComplaints(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}/status/IN_PROGRESS`);
  }

  searchComplaints(searchTerm: string): Observable<Complaint[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<Complaint[]>(`${this.API_URL}/search`, { params });
  }

  getComplaintCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }
}
