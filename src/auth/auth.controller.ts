import { Controller, Post, Body, Req, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async loginUser(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    const session = await this.authService.loginUser(loginUserDto);

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
    });
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
    });

    return res.json({
      status: 200,
      message: 'Successfully logged in!',
      data: session.accessToken,
    });
  }

  @Post('logout')
  @HttpCode(204)
  async logoutUser(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies.sessionId;
    if (sessionId) await this.authService.logoutUser(sessionId);

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.send();
  }

  @Post('refresh')
  @HttpCode(200)
  async refreshSession(@Req() req: Request, @Res() res: Response) {
    const { sessionId, refreshToken } = req.cookies;
    const session = await this.authService.refreshUsersSession(
      sessionId,
      refreshToken,
    );

    res.cookie('refreshToken', session.refreshToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
    });
    res.cookie('sessionId', session._id.toString(), {
      httpOnly: true,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30days
    });

    return res.json({
      status: 200,
      message: 'Successfully refreshed session!',
      data: {
        accessToken: session.accessToken,
      },
    });
  }
}
