import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { ChatComponent } from './chat/chat.component';
import { MessageComponent } from './message/message.component';
import { FormsModule } from '@angular/forms';
import { DisplayMsgTimestampPipe } from './display-msg-timestamp.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    ChatComponent,
    MessageComponent,
    DisplayMsgTimestampPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
