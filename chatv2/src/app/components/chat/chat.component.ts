import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { ApiService } from '../../service/api.service';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe', { static: false }) private scrollContainer!: ElementRef;

  isActived: boolean = false;
  isAdduser: boolean = false;
  amis: any[] = [];
  selectedConversation: any = null;
  userId!: string;
  inputMessage: string = '';
  countInseenMsg: any = {};
  Lastmessages: any = {};
userOline:any[]=[];
  data: any = {
    input: '',
    currentUserId: '',
  };


  constructor(
    private api: ApiService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('id') || '';
    this.data.currentUserId = this.userId;
    this.api.id = this.userId;
    console.log(this.userOline);
       
    // Connexion Socket
    this.socketService.connect(this.userId);
    console.log('Socket connecté avec ID:', this.userId);

    // Chargement des amis
    this.loadAmis();

    // Écoute des nouveaux messages
    this.socketService.onNewMessage((message) => {
      console.log('📩 Nouveau message reçu :', message);

      // Vérifie si le message appartient à la conversation ouverte
      if (
        this.selectedConversation &&
        (message.senderId === this.selectedConversation._id ||
          message.receverId === this.selectedConversation._id)
      ) {
        // Ajout du message
        this.selectedConversation.conversation.push(message);

        // Forcer la détection de changement
        this.cdr.detectChanges();

        // Attendre que le DOM soit mis à jour avant de scroller
        setTimeout(() => this.scrollToBottom(), 100);
      }

      // Recharge amis (badges, derniers msg, etc.)
      this.loadAmis();
    });
    
       this.socketService.onOnlineUsers((usersId: string[])=>{
             console.log('Users Online',usersId);
             this.userOline=usersId;
             
    })  

  
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  toggleButton() {
    this.isActived = !this.isActived;
  }

  openConversation(user: any) {
    this.api.getMessages(user._id).subscribe({
      next: (res) => {
        this.selectedConversation = {
          ...user,
          conversation: res.messages,
        };
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur chargement messages:', err);
      },
    });
  }

  addamis() {
    this.data.currentUserId = this.userId;

    this.api.addamis(this.data).subscribe({
      next: () => {
        this.loadAmis();
        this.data.input = '';
        this.isAdduser = false;

        this.socketService.sendMessage({
          senderId: this.userId,
          text: 'Nouvel ami ajouté',
        });
      },
      error: (err) => {
        console.error('Erreur ajout ami:', err);
      },
    });
  }

  

  sendMessage() {
    const text = this.inputMessage.trim();
    if (!text || !this.selectedConversation) return;

    const message = {
      senderId: this.userId,
      receverId: this.selectedConversation._id,
      text,
    };

    // Envoi via API
    this.api.sendMessage(this.selectedConversation._id, { text }).subscribe({
      next: (res) => {
        this.selectedConversation.conversation.push(res.message);
        this.cdr.detectChanges();
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur envoi message:', err);
      },
    });

    // Envoi via socket
    this.socketService.sendMessage(message);

    // Vider le champ
    this.inputMessage = '';
  }

  private loadAmis() {
    this.api.getAmis().subscribe({
      next: (res) => {
        this.amis = res.amis;
        this.countInseenMsg = res.unseenMessage;
        this.Lastmessages = res.LastMessages;
      },
      error: (err) => {
        console.error('Erreur chargement amis:', err);
      },
    });
  }

  getHeureMinutes(date: any): string {
    const dateObj =
      typeof date === 'string' || date instanceof String
        ? new Date(date.toString())
        : date;

    const heures = dateObj.getHours();
    const minutes = dateObj.getMinutes();

    const heuresStr = heures < 10 ? '0' + heures : heures.toString();
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${heuresStr}:${minutesStr}`;
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erreur scrollToBottom:', err);
    }
  }
}
