import { Body, Controller, HttpException, HttpStatus, Post, Session } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendAdminLoginCodeDto } from './dto/send-admin-login-code.dto';
import { VerifyAdminLoginCodeDto } from './dto/verify-admin-login-code.dto';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-login-code')
  async sendLoginCode(@Body() body: SendAdminLoginCodeDto, @Session() session: Record<string, any>) {
    const { phone } = body;
    const user = await this.authService.findAdminByPhone(phone);
    if (!user) {
      throw new HttpException('Admin user not found', HttpStatus.NOT_FOUND);
    }
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Store the code (and phone) in the session (backed by Redis)
    session.verificationCode = code;
    session.phone = phone;
    // Simulate sending SMS (in production, integrate with an SMS service)
    console.log(`Sending SMS to ${phone}: Your verification code is ${code}`);
    return { message: 'Verification code sent' };
  }

  @Post('verify-login-code')
  async verifyAdmin(@Body() body: VerifyAdminLoginCodeDto, @Session() session: Record<string, any>) {
    const { phone, code } = body;
    if (session.phone !== phone || session.verificationCode !== code) {
      throw new HttpException('Invalid verification code', HttpStatus.UNAUTHORIZED);
    }
    // Verification successful—set the user info in session for logged-in state
    session.user = await this.authService.findAdminByPhone(phone);
    // Remove the verification code from session for security
    delete session.verificationCode;
    return { message: 'Admin verified and logged in' };
  }
}
