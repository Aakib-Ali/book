
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Donation, DonationDecision } from '../models/donation';
import { ApiResponse } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private readonly API_URL = 'http://localhost:8080/api/donations';

  constructor(private http: HttpClient) {}

  getDonations(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.API_URL}`);
  }

  getPendingDonations(): Observable<Donation[]> {
    return this.http.get<Donation[]>(`${this.API_URL}/PENDING`);
  }

  getDonationById(id: string): Observable<Donation> {
    return this.http.get<Donation>(`${this.API_URL}/${id}`);
  }

  approveDonation(donationDecision: DonationDecision): Observable<Donation> {
    return this.http.patch<Donation>(
      `${this.API_URL}/${donationDecision.donationId}/APPROVE`, 
      { comments: donationDecision.comments }
    );
  }

  rejectDonation(donationDecision: DonationDecision): Observable<Donation> {
    return this.http.patch<Donation>(
      `${this.API_URL}/${donationDecision.donationId}/REJECT`, 
      { comments: donationDecision.comments }
    );
  }

  searchDonations(searchTerm: string): Observable<Donation[]> {
    const params = new HttpParams().set('search', searchTerm);
    return this.http.get<Donation[]>(`${this.API_URL}/search`, { params });
  }

  getPendingDonationsCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.API_URL}/pending-count`);
  }
}

