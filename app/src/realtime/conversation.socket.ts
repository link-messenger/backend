import { Socket } from "socket.io";
import { SOCKET_MESSAGE_EVENTS } from "../constants";

export const onConversationCreate = ({socket, to, conversation}: {socket: Socket, to: string,conversation}) => {
  socket.to(to).emit(SOCKET_MESSAGE_EVENTS["conversation.create"], conversation); 
}