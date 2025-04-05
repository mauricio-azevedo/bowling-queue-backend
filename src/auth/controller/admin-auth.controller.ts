import { Body, Controller, HttpException, HttpStatus, Post, Session } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { VerifyAdminLoginCodeDto } from '../dto/verify-admin-login-code.dto';
import { PrimaryAdminLoginDto } from '../dto/primary-admin-login.dto';

@Controller('auth/admin')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('primary-login')
  async primaryLogin(@Body() body: PrimaryAdminLoginDto, @Session() session: Record<string, any>) {
    const { phone, password } = body;
    await this.authService.validateAdminCredentials(phone, password);
    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    // Store code and phone in the session (backed by Redis)
    session.verificationCode = verificationCode;
    session.phone = phone;
    // Simulate sending SMS (replace with actual SMS integration in production)
    console.log(`Sending SMS to ${phone}: Your verification code is ${verificationCode}`);
    return { message: 'Verification code sent' };
  }

  @Post('verify-login-code')
  async verifyLoginCode(@Body() body: VerifyAdminLoginCodeDto, @Session() session: Record<string, any>) {
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
