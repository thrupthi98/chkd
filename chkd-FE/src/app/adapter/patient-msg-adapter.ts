import { ChatAdapter, IChatGroupAdapter, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant, IChatController } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay, first, map } from "rxjs/operators";
import { MessagesService } from 'src/services/Messages.service';
import {PatientService} from '../../services/Patient.service';
import io from "socket.io-client";
import { HttpClient } from '@angular/common/http';

export class PatientMessageAdapter extends ChatAdapter implements IChatGroupAdapter {
  
    public static mockedParticipants: IChatParticipant[] = [
    {participantType: ChatParticipantType.User,
    id: 999,
    displayName: "CHKD Pre-op",
    avatar: "https://i.stack.imgur.com/ZQT8Z.png",
    status: ChatParticipantStatus.Online
    }
  ];

  private url = 'http://18.220.186.21:3000';
  private socket;

  public mockedHistory: Array<Message> = [];


    constructor(
        private messagesService : MessagesService,
        private surgery_id,
        private http: HttpClient
    ){
        super();
        this.getMessages()
      }

    getMessages(){
      
      // this.socket = io.connect(this.url);

      // this.socket.on(this.surgery_id, (data) => {
      //   console.log(data)
      //     let message = new Message();
      //     message.fromId = data['data']['toId'];
      //     message.toId = data['data']['fromId'];
      //     message.message = data['data']['message'];
      //     message.dateSent =  data['data']['dateSent'];
      //     this.mockedHistory.push( {
      //         fromId: data['data']['toId'],
      //         toId: data['data']['fromId'],
      //         message: data['data']['message'],
      //         dateSent: data['data']['dateSent']
      //       })
      //       this.onMessageReceived(PatientMessageAdapter.mockedParticipants[0], message);
      // });
    
          
    }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(PatientMessageAdapter.mockedParticipants.map(user => {
      let participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: Math.floor(Math.random() * 10)
      }

      return participantResponse;
    }));
  }

  getMessageHistory(): Observable<Message[]> {
    return this.http.get(`http://18.220.186.21:3000/messages`,{
      headers: {
        "Content-Type": "application/json",
        "X-auth-header": this.surgery_id,
      },
  }).pipe(
    map((data: any) => {
      data["messageHistory"].forEach(element => {
        let message = new Message();
        message.fromId = element['idFrom'];
        message.toId = element['idTo'];
        message.message = element['content'];
        message.dateSent =  new Date(parseInt(element['timestamp']));
        this.mockedHistory.push(message)
      });
      return this.mockedHistory
    })
  )
  }

  async sendMessage(message: Message){
    console.log(message)
    this.socket = io(this.url);
    await this.messagesService.sendMessages(message,this.socket)

    // setTimeout(() => {
    //   let replyMessage = new Message();

    //   replyMessage.message = "You have typed '" + message.message + "'";
    //   replyMessage.dateSent = new Date();

    //   if (isNaN(message.toId)) {
    //     console.log(message.toId)
    //     let group = PatientMessageAdapter.mockedParticipants.find(x => x.id == message.toId) as Group;

    //     // Message to a group. Pick up any participant for this
    //     let randomParticipantIndex = Math.floor(Math.random() * group.chattingTo.length);
    //     replyMessage.fromId = group.chattingTo[randomParticipantIndex].id;

    //     replyMessage.toId = message.toId;

    //     this.onMessageReceived(group, replyMessage);
    //   }
    //   else {
    //     replyMessage.fromId = message.toId;
    //     replyMessage.toId = message.fromId;

    //     let user = PatientMessageAdapter.mockedParticipants.find(x => x.id == replyMessage.fromId);
    //     this.onMessageReceived(user, replyMessage);
    //   }
    // }, 1000);
  }

  groupCreated(group: Group): void {
    PatientMessageAdapter.mockedParticipants.push(group);

    PatientMessageAdapter.mockedParticipants = PatientMessageAdapter.mockedParticipants.sort((first, second) =>
      second.displayName > first.displayName ? -1 : 1
    );

    // Trigger update of friends list
    this.listFriends().subscribe(response => {
        this.onFriendsListChanged(response);
      });
  }
}