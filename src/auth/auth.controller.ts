import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService, // Service to interact with the User entity
  ) {}

  // @Post('send-code')
  // async sendCode(@Body('phone') phone: string) {
  //   await this.authService.sendVerificationCode(phone);
  //   return { message: 'Verification code sent' };
  // }

  // @Post('verify-code')
  // async verifyCode(
  //   @Body('phone') phone: string,
  //   @Body('code') code: string,
  //   @Req() req: Request,
  //   @Res() res: Response,
  // ) {
  //   const isValid = await this.authService.verifyCode(phone, code);
  //   if (!isValid) {
  //     return res
  //       .status(HttpStatus.BAD_REQUEST)
  //       .json({ message: 'Invalid code' });
  //   }
  //
  //   // Retrieve or create the user
  //   const user = await this.usersService.findOrCreateByPhone(phone);
  //
  //   // Create session (store minimal user info)
  //   req.session.user = { id: user.id, phone: user.phone, role: user.role };
  //
  //   return res.json({ message: 'Logged in successfully' });
  // }
}
