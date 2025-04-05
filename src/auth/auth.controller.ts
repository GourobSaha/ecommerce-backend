import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(loginDto.email, loginDto.password);
        return this.authService.login(user);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req) {
        await this.authService.logout(req.user.userId);
        return { message: 'Logged out successfully' };
    }
}
