import { ChatAdapter, IChatGroupAdapter, User, Group, Message, ChatParticipantStatus, ParticipantResponse, ParticipantMetadata, ChatParticipantType, IChatParticipant, IChatController } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { delay } from "rxjs/operators";
import { MessagesService } from 'src/services/Messages.service';
import {PatientService} from '../../services/Patient.service';
import io from "socket.io-client";

export class PatientMessageAdapter extends ChatAdapter implements IChatGroupAdapter {
  
    public static mockedParticipants: IChatParticipant[] = [
    {participantType: ChatParticipantType.User,
    id: 999,
    displayName: "CHKD Pre-op",
    avatar: "https://i.stack.imgur.com/ZQT8Z.png",
    status: ChatParticipantStatus.Online
    }
  ];

  private url = 'http://localhost:3000';
  private socket;

  public mockedHistory: Array<Message> = [];


    constructor(
        private messagesService : MessagesService,
    ){
        super();
        this.getMessages()
        // this.getMessageHistory()
    }

    getMessages(){
        this.messagesService.getMessagesForPatient("rF44BBwNF").subscribe(async (res)=>{
            console.log(res['messageHistory'])
            res['messageHistory'].forEach(ele => {
                this.mockedHistory.push({
                    fromId: ele['fromId'],
                    toId: ele['toId'],
                    message: ele['content'],
                    dateSent: ele['dateSent']
                })
            });

            await this.getMessageHistory();

            this.socket = io.connect(this.url);

    
            this.socket.on("rF44BBwNF", (data) => {
                let message = new Message();
                message.fromId = data['data']['fromId'];
                message.toId = data['data']['toId'];
                message.message = data['data']['message'];
                message.dateSent =  data['data']['dateSent'];
                console.log(message)
                this.mockedHistory.push( {
                    fromId: data['data']['toId'],
                    toId: data['data']['fromId'],
                    message: data['data']['message'],
                    dateSent: data['data']['dateSent']
                  })
                  this.onMessageReceived(PatientMessageAdapter.mockedParticipants[0], message);
            });
          },(err)=>{
            console.log(err)
          })
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
    return of(this.mockedHistory).pipe(delay(2000));
  }

  async sendMessage(message: Message){
    console.log(PatientMessageAdapter.mockedParticipants)
    // this.socket = io(this.url);
    // await this.messagesService.sendMessages(message,this.socket)

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