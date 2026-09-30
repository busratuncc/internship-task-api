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
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';
import { ProjectsService } from './projects.service.js';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Req() request: AuthenticatedRequest, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(request.user.id, dto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.projectsService.findAll(request.user.id);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.findOne(id, request.user.id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, request.user.id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.projectsService.remove(id, request.user.id);
  }
}
