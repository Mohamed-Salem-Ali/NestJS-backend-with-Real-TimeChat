import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Application Status' })
  @ApiResponse({
    status: 200,
    description: 'Returns the status of the application',
  })
  root() {
    return {
      message: 'Welcome to the MSA Social App',
      status: 'Running',
    };
  }
}
