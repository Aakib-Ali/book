export interface Donation {
  id: string;
  memberId: string;
  memberName: string;
  bookTitle: string;
  author: string;
  condition: string;
  quantity: number;
  description?: string;
  imageUrl?: string;
  submissionDate: Date;
  status: string;
  adminComments?: string;
  reviewedBy?: string;
  reviewDate?: Date;
}

export interface DonationDecision {
  donationId: string;
  decision: 'APPROVED' | 'REJECTED';
  comments: string;
}
export interface ApiResponse<T>{
  sussess:string;
  message:string;
  data: T;
}
