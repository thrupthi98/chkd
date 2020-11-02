import { ChatAdapter, IChatGroupAdapter, User, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay } from "rxjs/operators";
import { MessagesService } from 'src/services/Messages.service';
import {PatientService} from '../../services/Patient.service';
import io from "socket.io-client";

export class MessageAdapter extends ChatAdapter implements IChatGroupAdapter {
  public static mockedParticipants: IChatParticipant[] = [];
  private url = 'http://localhost:3000';
  private socket;

    constructor(
        private patientService : PatientService,
        private messagesService : MessagesService,
    ){
        super();
        this.getPatients()
    }

    getPatients(){
        this.patientService.getAllPatients().subscribe((res)=>{
            res['data'].forEach(element => {
                  MessageAdapter.mockedParticipants.push({
                      participantType: ChatParticipantType.User,
                      id: element.id,
                      displayName: element.nickname,
                      avatar: element.photoUrl,
                      status: ChatParticipantStatus.Online
                  })
              });
              this.listFriends().subscribe(response => {
                this.onFriendsListChanged(response);
              });
          })
    }

  listFriends(): Observable<ParticipantResponse[]> {
    return of(MessageAdapter.mockedParticipants.map(user => {
      let participantResponse = new ParticipantResponse();

      participantResponse.participant = user;
      participantResponse.metadata = {
        totalUnreadMessages: Math.floor(Math.random() * 10)
      }

      return participantResponse;
    }));
  }

  getMessageHistory(destinataryId: any): Observable<Message[]> {
    let mockedHistory: Array<Message>;

    mockedHistory = [
      // {
      //   fromId: 1,
      //   toId: 999,
      //   message: "Hi there, just type any message bellow to test this Angular module.",
      //   dateSent: new Date()
      // }
    ];

    console.log(mockedHistory)

    return of(mockedHistory).pipe(delay(2000));
  }

  async sendMessage(message: Message){
    this.socket = io(this.url);
    await this.messagesService.sendMessages(message,this.socket)

    // setTimeout(() => {
    //   let replyMessage = new Message();

    //   replyMessage.message = "You have typed '" + message.message + "'";
    //   replyMessage.dateSent = new Date();

    //   if (isNaN(message.toId)) {
    //     console.log(message.toId)
    //     let group = MessageAdapter.mockedParticipants.find(x => x.id == message.toId) as Group;

    //     // Message to a group. Pick up any participant for this
    //     let randomParticipantIndex = Math.floor(Math.random() * group.chattingTo.length);
    //     replyMessage.fromId = group.chattingTo[randomParticipantIndex].id;

    //     replyMessage.toId = message.toId;

    //     this.onMessageReceived(group, replyMessage);
    //   }
    //   else {
    //     replyMessage.fromId = message.toId;
    //     replyMessage.toId = message.fromId;

    //     let user = MessageAdapter.mockedParticipants.find(x => x.id == replyMessage.fromId);

    //     this.onMessageReceived(user, replyMessage);
    //   }
    // }, 1000);
  }

  groupCreated(group: Group): void {
    MessageAdapter.mockedParticipants.push(group);

    MessageAdapter.mockedParticipants = MessageAdapter.mockedParticipants.sort((first, second) =>
      second.displayName > first.displayName ? -1 : 1
    );

    // Trigger update of friends list
    
  }
}