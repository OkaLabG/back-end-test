import { Controller, Post, Body } from '@nestjs/common';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(@Body() createSession: { userName: string; password: string }) {
    return this.sessionsService.execute(
      createSession.userName,
      createSession.password,
    );
  }
}
