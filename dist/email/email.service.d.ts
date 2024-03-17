import { MailerService } from '@nestjs-modules/mailer';
import { User } from 'src/user/entities/user.entity';
export declare class EmailService {
    private readonly mailService;
    constructor(mailService: MailerService);
    sendUserWelcomeEmail(user: User, token: string): Promise<void>;
}
