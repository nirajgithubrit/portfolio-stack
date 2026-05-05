import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import type { ContactMessage } from '../../shared/models';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './admin-messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminMessagesComponent implements OnInit {
  private readonly http = inject(HttpClient);

  readonly items = signal<ContactMessage[]>([]);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.http.get<ContactMessage[]>('/api/contact').subscribe({
      next: (rows) => this.items.set(rows),
      error: () => this.error.set('Failed to load messages (auth required)'),
    });
  }

  trackById = (_: number, m: ContactMessage) => m._id;
}
