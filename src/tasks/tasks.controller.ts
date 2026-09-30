import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/jwt-auth/jwt-auth.guard.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';
import { TasksService } from './tasks.service.js';

@UseGuards(JwtAuthGuard)
@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('projects/:projectId/tasks')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create(projectId, request.user.id, dto);
  }

  @Get('projects/:projectId/tasks')
  findAllForProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.findAllForProject(projectId, request.user.id);
  }

  @Get('tasks/:id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.findOne(id, request.user.id);
  }

  @Patch('tasks/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateTaskDto,
  ) {
    return this.tasksService.update(id, request.user.id, dto);
  }

  @Delete('tasks/:id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.tasksService.remove(id, request.user.id);
  }
}
