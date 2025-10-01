import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;

  constructor() {}

  // Connexion avec l'ID utilisateur
  connect(userId: string) {
    console.log('🔌 Tentative de connexion au socket avec userId:', userId);

    this.socket = io('http://localhost:3000', {
      query: { userId },
    });

    this.socket.on('connect', () => {
      console.log('✅ Connecté au serveur Socket.IO avec ID:', this.socket.id);
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Erreur de connexion au socket:', err);
    });

    this.socket.on('disconnect', (reason) => {
      console.warn('⚠️ Déconnecté du socket. Raison:', reason);
    });
  }

  // Écouter les nouveaux messages
  onNewMessage(callback: (msg: any) => void) {
    this.socket.on('newMessage', (msg) => {
      console.log('📨 Nouveau message reçu:', msg);
      
      callback(msg);
      
    });
  }

  // Écouter les utilisateurs en ligne
  onOnlineUsers(callback: (userIds: string[]) => void) {
    this.socket.on('getOnlineUsers', (userIds) => {
      console.log('🟢 Utilisateurs en ligne reçus:', userIds);
      callback(userIds);
    });
  }

  // Envoyer un message
  sendMessage(message: any) {
    console.log('📤 Envoi du message:', message);
    this.socket.emit('sendMessage', message);
  }

  // Déconnexion
  disconnect() {
    if (this.socket) {
      console.log('🔌 Déconnexion du socket avec ID:', this.socket.id);
      this.socket.disconnect();
    }
  }
}
