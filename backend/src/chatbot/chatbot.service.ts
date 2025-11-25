import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatbotService {
  constructor(private prisma: PrismaService) {}

  async handleMessage(user: User, message: string) {
    const lowerCaseMessage = message.toLowerCase();

    if (lowerCaseMessage.includes('order status')) {
      const lastOrder = await this.prisma.order.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });

      if (!lastOrder) {
        return { reply: "You don't have any orders yet." };
      }
      return {
        reply: `Your last order (${lastOrder.id}) status is: ${lastOrder.status}`,
      };
    }

    if (lowerCaseMessage.includes('help')) {
      return {
        reply:
          'You can ask me about your "order status". More features coming soon!',
      };
    }

    return {
      reply: "Sorry, I don't understand that. You can ask for 'help'.",
    };
  }
}
