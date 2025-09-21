import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../../services/book';
import { NotificationService } from '../../../services/notification';
import { Book } from '../../../models/book';
import { BOOK_CATEGORIES } from '../../../utils/constants';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog';
import { PaginationComponent } from '../../shared/pagination/pagination';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap } from 'rxjs';
import { errorContext } from 'rxjs/internal/util/errorContext';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PaginationComponent, ConfirmationDialogComponent],
  templateUrl: './book-list.html',
  styleUrls: ['./book-list.css']
})
export class BookListComponent implements OnInit {
  books: Book[] = [];
  allBooks: any[]=[];
  bookCategories = BOOK_CATEGORIES;
  isLoading = false;
  
  // Search and Filters
  searchTerm = '';
  selectedCategory = '';
  selectedStatus = '';
  
  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalBooks = 0;
  pageSize = 10;

  // Delete functionality
  showDeleteConfirmation = false;
  bookToDelete: Book | null = null;
  isDeleting = false;

  ngOnInit(): void {
    
    this.loadInitialData();
    this.setupRealTimeSearch();
  }

  private searchSubject=new Subject<string>();
  private subscription: Subscription =new Subscription();

  constructor(
    private bookService: BookService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

   



  loadInitialData(): void {
    this.isLoading = true;
    const booksSubscription = this.bookService.getBooks().subscribe(
      (response) => {
        if (response && response.data) {
          this.allBooks = response.data;
          this.books = [...this.allBooks]; // Copy for display
          this.extractCategories();
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading books:', error);
        this.isLoading = false;
      }
    );
    this.subscription.add(booksSubscription);
  }

  // Extract unique categories from books
  extractCategories(): void {
    const categories = [...new Set(this.allBooks.map(book => book.category))];
    this.bookCategories = categories.filter(cat => cat); // Remove empty categories
  }

  // Setup real-time search with debouncing
  setupRealTimeSearch(): void {
    const searchSubscription = this.searchSubject.pipe(
      debounceTime(300), // Wait 300ms after user stops typing
      distinctUntilChanged(), // Only search if term changed
      switchMap((searchTerm: string) => {
        this.isLoading = true;
        if (searchTerm.trim()) {
          return this.bookService.searchBooksRealTime(searchTerm, 'all');
        } else {
          // If search is empty, return all books
          this.books = this.filterByOtherCriteria([...this.allBooks]);
          this.isLoading = false;
          return [];
        }
      })
    ).subscribe(
      (response) => {
        this.isLoading = false;
        if (response && response.data) {
          this.books = this.filterByOtherCriteria(response.data);
        }
      },
      (error) => {
        this.isLoading = false;
        console.error('Search error:', error);
      }
    );

    this.subscription.add(searchSubscription);
  }


  // Filter by category and status (client-side filtering for non-search criteria)
  filterByOtherCriteria(books: any[]): any[] {
    let filteredBooks = [...books];

    if (this.selectedCategory) {
      filteredBooks = filteredBooks.filter(book => 
        book.category === this.selectedCategory
      );
    }

    if (this.selectedStatus) {
      filteredBooks = filteredBooks.filter(book => 
        book.status === this.selectedStatus
      );
    }

    return filteredBooks;
  }






  loadBooks() {
    this.isLoading = true;
    
    this.bookService.getBooks(this.currentPage, this.pageSize, this.buildSearchQuery()).subscribe({
      next: (response) => {
        this.books = response.data || [];
        this.totalPages = response.data.length/10 || 0;
        this.totalBooks = response.data.length || 0;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.notificationService.showError('Failed to load books');
        this.isLoading = false;
      }
    });
  }

  private buildSearchQuery(): string {
    const filters = [];
    if (this.searchTerm) filters.push(`search=${this.searchTerm}`);
    if (this.selectedCategory) filters.push(`category=${this.selectedCategory}`);
    if (this.selectedStatus) filters.push(`status=${this.selectedStatus}`);
    return filters.join('&');
  }

  onSearch() {
    this.currentPage = 0;
    this.loadBooks();
  }

  onCategoryChange() {
    this.currentPage = 0;
    this.loadBooks();
  }

  onStatusChange() {
    this.currentPage = 0;
    this.loadBooks();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.currentPage = 0;
    this.loadBooks();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.loadBooks();
  }

  getBookStatus(book: Book): string {
  console.log(book);
  if (!book.active || book.totalCopies === 0) return 'danger';
  if (book.availableCopies > 0) return 'success';
  return 'warning';
}

getBookStatusText(book: Book): string {
  return book.availabilityStatus;
}


  viewBorrowers(bookId: string) {
    this.router.navigate(['/admin/books/borrowers', bookId]);
  }

  editBook(bookId: string) {
    this.router.navigate(['/admin/books/edit', bookId]);
  }

  deleteBook(book: Book) {
    this.bookToDelete = book;
    this.showDeleteConfirmation = true;
  }

  confirmDelete() {
    if (!this.bookToDelete) return;
    
    this.isDeleting = true;
    
    this.bookService.deleteBook(this.bookToDelete.id).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Book "${this.bookToDelete?.title}" deleted successfully`);
        this.showDeleteConfirmation = false;
        this.bookToDelete = null;
        this.isDeleting = false;
        this.loadBooks(); // Reload the list
      },
      error: (error) => {
        console.error('Error deleting book:', error);
        this.notificationService.showError('Failed to delete book');
        this.isDeleting = false;
      }
    });
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.bookToDelete = null;
  }
}