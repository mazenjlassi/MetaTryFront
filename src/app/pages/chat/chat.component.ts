import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  conversations: any[] = [];
  selectedConversationId!: number;

  messages: any[] = [];
  newMessage = '';

  conclusion = '';
  loading = false;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.loadConversations();
  }

  // ================= LOAD =================

  loadConversations() {
    this.chatService.getConversations().subscribe(res => {
      this.conversations = res;
    });
  }

  selectConversation(id: number) {
    this.selectedConversationId = id;
    this.loadMessages();
  }

  loadMessages() {
    this.chatService.getMessages(this.selectedConversationId).subscribe(res => {
      this.messages = res;
    });
  }

  // ================= ACTIONS =================

  createConversation() {
    this.chatService.createConversation('New Chat').subscribe(res => {
      this.conversations.unshift(res);
      this.selectConversation(res.id);
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    const temp = {
      role: 'USER',
      content: this.newMessage
    };

    this.messages.push(temp);

    this.loading = true;

    this.chatService
      .sendMessage(this.selectedConversationId, this.newMessage)
      .subscribe({
        next: (res) => {
          this.messages.push(res);
          this.loading = false;

          // 🔥 THIS IS THE FIX
          this.loadConversations(); // refresh titles
        },
        error: () => {
          this.loading = false;
        }
      });

    this.newMessage = '';
  }

  generateConclusion() {
    this.chatService
      .generateConclusion(this.selectedConversationId)
      .subscribe(res => {
        this.conclusion = res;
      });
  }
}