import { Component,AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messageList', { static: false }) messageList!: ElementRef;
 
  messages: Message[] = []; // hardcoded for the moment
  newMessageText: string = '';
  sender!: string;

  addMessage(inputMessage: string) : void {
    inputMessage = inputMessage.trim();

    if (inputMessage.length === 0) {
      return;
    }
    
    this.sender = this.messages.length % 2 === 0 ? 'me' : 'other';
    this.messages.push(new Message(inputMessage, new Date(), this.sender));
    this.newMessageText = '';
  }

  ngAfterViewChecked(): void {
    setTimeout(() => this.scrollToBottom(), 0);
  }

  scrollToBottom(): void {
    try {
      this.messageList.nativeElement.scrollTop = this.messageList.nativeElement.scrollHeight;
    } catch(error) { 
      console.log(error);
    }
  }
}
