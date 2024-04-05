import { Injectable } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway({ transports: ['websocket'], cors: true })
@Injectable()
export default class GameGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {}
