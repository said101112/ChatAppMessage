import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
  Output,
  AfterViewChecked,
} from '@angular/core';
import { ApiService } from '../../service/api.service';
import { SocketService } from '../../service/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy,AfterViewChecked {
  @ViewChild('scrolldiv') scrolldiv!:ElementRef<HTMLDivElement>;
  
  isActived : boolean=false;
  isAdduser : boolean = false;
  amis: any[] = [];
  selectedConversation: any = null;
  userData: any = {};
  showEditModal = false;
  editingField = '';
  editValue = '';
  Room:any="";
  userId!: string;
  inputMessage: string = '';
  countInseenMsg: any = {};
  Lastmessages: any = {};
  userOline:any[]=[];
  openProfil : boolean =false;
  data: any = {
    input: '',
    currentUserId: '',
  };
  private shouldAutoScroll = true;
  handleProfil(){
    this.openProfil=!this.openProfil;
  }

  constructor(
    private api: ApiService,
    private socketService: SocketService,
    private cdr: ChangeDetectorRef
  ) {}
  ngAfterViewChecked(): void {
  if (this.shouldAutoScroll) {
    this.scrollToBottom();
  }
}


  private scrollToBottom(): void {
  if (this.scrolldiv) {
    setTimeout(() => {
      const div = this.scrolldiv.nativeElement;
      div.scrollTop = div.scrollHeight;
    }, 0);
  }
}

onScroll(): void {
  const div = this.scrolldiv.nativeElement;
  const distanceFromBottom = div.scrollHeight - div.scrollTop - div.clientHeight;

  // Si l’utilisateur est proche du bas (< 100px), on active le scroll auto
  this.shouldAutoScroll = distanceFromBottom < 100;
}


userProfilParent: any;

receiveUser(data: any) {
  this.userProfilParent = data;
  console.log('Profil reçu du composant enfant :', data);
}

  editField(field: string) {
    this.editingField = field;
    this.editValue = this.getFieldValue(field);
    this.showEditModal = true;
  }

  getFieldValue(field: string): string {
    switch (field) {
      case 'username': return this.userData.username;
      case 'email': return this.userData.email;
      case 'phone': return this.userData.phone || '';
      case 'bio': return this.userData.bio || '';
      case 'status': return this.userData.status || '';
      default: return '';
    }
  }

  getFieldLabel(field: string): string {
    const labels: any = {
      'username': 'nom d\'utilisateur',
      'email': 'email',
      'phone': 'téléphone',
      'bio': 'bio',
      'status': 'statut'
    };
    return labels[field] || field;
  }

  saveEdit() {
    const updateData = { [this.editingField]: this.editValue };
    
   
    
  }

  cancelEdit() {
    this.showEditModal = false;
    this.editingField = '';
    this.editValue = '';
  }

  getLastSeen(lastSeen: string): string {
    if (!lastSeen) return 'Inconnu';
    const date = new Date(lastSeen);
    return date.toLocaleDateString('fr-FR') + ' à ' + date.toLocaleTimeString('fr-FR');
  }

  getLanguageName(lang: string): string {
    const languages: any = {
      'fr': 'Français',
      'en': 'English',
      'es': 'Español'
    };
    return languages[lang] || lang;
  }

  changeAvatar() {
    // Logique pour changer l'avatar
    console.log('Changer avatar');
  }

  changePassword() {
    // Logique pour changer le mot de passe
    console.log('Changer mot de passe');
  }

  exportData() {
    // Logique pour exporter les données
    console.log('Exporter données');
  }

  deleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
     
    
    }
  }

  

  goBack() {
    
  }
  ngOnInit(): void {
    this.userId = localStorage.getItem('id') || '';
    this.data.currentUserId = this.userId;
    
   
   
    this.api.id = this.userId;
    console.log(this.userOline);
       
    // Connexion Socket
    this.socketService.connect(this.userId);
    console.log('Socket connecté avec ID:', this.userId);
     setTimeout(()=>{
       this.Room = this.generateRoomId();
       
     this.socketService.joinRoom(this.Room);
     console.log("le Room est : ",this.Room);
    },500)

    // Chargement des amis
    this.loadAmis();
this.socketService.onFriendAdded( (data:any)=>{
       this.showToast("✅ Nouvel ami ajouté !");
       console.log(data);
       this.loadAmis(); // refresh la liste amis
   });
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

        this.showToast("📩 Nouveau message reçu !");
      }

      // Recharge amis (badges, derniers msg, etc.)
      this.loadAmis();
    });
    
       this.socketService.onOnlineUsers((usersId: string[])=>{
             console.log('Users Online',usersId);
             this.userOline=usersId;
             
    })  

  
  }
  generateRoomId() {
  const timestamp = Date.now(); // ex: 1730417559000
  const random = Math.floor(Math.random() * 10000); // ex: 4821
  return `room_${timestamp}_${random}`;
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
        console.log("this is the conversation of : ",this.selectedConversation);
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
        const code=this.data.input;
        this.data.input = '';
        this.isAdduser = false;
        console.log('ccccccccccccc:',this.data.input)
        this.socketService.Addf(this.userId,code);
        this.socketService.sendMessage(this.Room,{
          senderId: this.userId,
          text: 'Nouvel ami ajouté',
        });
        this.loadAmis();
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
    this.socketService.sendMessage(this.Room,message);

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
  // ✅ Si la date n'existe pas, on retourne une chaîne vide
  if (!date) {
    return '';
  }

  const dateObj =
    typeof date === 'string' || date instanceof String
      ? new Date(date.toString())
      : date;

  // ✅ Si ce n’est pas une vraie date (par exemple texte ou objet invalide)
  if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
    return '';
  }

  const heures = dateObj.getHours();
  const minutes = dateObj.getMinutes();

  const heuresStr = heures < 10 ? '0' + heures : heures.toString();
  const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();

  return `${heuresStr}:${minutesStr}`;
}


toastMessage: string = '';

showToast(msg: string) {
  this.toastMessage = msg;
  setTimeout(() => this.toastMessage = '', 2500); // auto remove
}



  openMenuIndex: number | null = null;

  // Fonction pour ouvrir/fermer le menu
  toggleConversationMenu(index: number, event: Event) {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }
}
