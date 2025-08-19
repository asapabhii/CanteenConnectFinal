import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator/get-user.decorator';
import { ChatbotService } from './chatbot.service';
import { ChatDto } from './dto/chat.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post()
  handleMessage(@GetUser() user: User, @Body() dto: ChatDto) {
    return this.chatbotService.handleMessage(user, dto.message);
  }
}