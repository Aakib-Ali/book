export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  imageUrl?: string;
  totalCopies: number;
  availableCopies: number;
  active: boolean;
  availabilityStatus: string;
  createdDate: Date;
  updatedDate?: Date;
}

export interface BookBorrower {
  memberId: string;
  memberName: string;
  email: string;
  borrowDate: Date;
  dueDate: Date;
  copiesBorrowed: number;
  status: 'Active' | 'Overdue';
}

export interface BookFormData {
  title: string;
  author: string;
  category: string;
  description: string;
  totalCopies: number;
  imageFile?: any;
}

export interface ApiResponse<T>{
  sussess:string;
  message:string;
  data: T;
}

