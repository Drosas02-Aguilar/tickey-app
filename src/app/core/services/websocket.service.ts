import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


declare var SockJS: any;
declare var Stomp: any;

@Injectable({ providedIn: 'root' })
export class WebsocketService {

  private stompClient: any = null;
  private notificationSubject = new Subject<any>();
  notifications$ = this.notificationSubject.asObservable();

  connect(usuarioId: number): void {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.debug = null;

    this.stompClient.connect({}, () => {

      console.log('🟢 WebSocket conectado');

      this.stompClient.subscribe(
        `/topic/notificaciones/${usuarioId}`,
        (message: any) => {
          const notificacion = JSON.parse(message.body);
          this.notificationSubject.next(notificacion);
        }
      );

    }, (error: any) => {
      console.error('🔴 Error WS:', error);
    });
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect(() => {
        console.log('🔌 WebSocket desconectado');
      });
    }
  }
}