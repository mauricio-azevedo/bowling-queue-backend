import { Body, Controller, HttpException, HttpStatus, Post, Session } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { SendCustomerLoginCodeDto } from '../dto/send-customer-login-code.dto';
import { VerifyCustomerLoginCodeDto } from '../dto/verify-customer-login-code.dto';

@Controller('auth/customer')
export class CustomerAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-login-code')
  async sendLoginCode(@Body() body: SendCustomerLoginCodeDto, @Session() session: Record<string, any>) {
    const { phone } = body;
    const user = await this.authService.findCustomerByPhone(phone);
    if (!user) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    // Store the code and phone in the session (backed by Redis)
    session.verificationCode = code;
    session.phone = phone;
    // Simulate sending a WhatsApp message (replace with an actual integration in production)
    console.log(`Sending WhatsApp message to ${phone}: Your verification code is ${code}`);
    return { message: 'Verification code sent via WhatsApp' };
  }

  @Post('verify-login-code')
  async verifyLoginCode(@Body() body: VerifyCustomerLoginCodeDto, @Session() session: Record<string, any>) {
    const { phone, code } = body;
    if (session.phone !== phone || session.verificationCode !== code) {
      throw new HttpException('Invalid verification code', HttpStatus.UNAUTHORIZED);
    }
    // Verification successful—mark the session as authenticated by storing the customer data
    session.user = await this.authService.findCustomerByPhone(phone);
    // Remove the temporary verification code from the session for security
    delete session.verificationCode;
    return { message: 'Customer verified and logged in' };
  }
}
