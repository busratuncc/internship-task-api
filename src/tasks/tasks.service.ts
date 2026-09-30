import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { UpdateTaskDto } from './dto/update-task.dto.js';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  private async requireOwnedProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
      select: {
        id: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Proje bulunamadı');
    }

    return project;
  }

  private async requireOwnedTask(taskId: number, userId: number) {
    const task = await this.prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          ownerId: userId,
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Görev bulunamadı');
    }

    return task;
  }

  async create(projectId: number, userId: number, dto: CreateTaskDto) {
    await this.requireOwnedProject(projectId, userId);

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        completed: dto.completed ?? false,
        projectId,
      },
    });
  }

  async findAllForProject(projectId: number, userId: number) {
    await this.requireOwnedProject(projectId, userId);

    return this.prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(taskId: number, userId: number) {
    return this.requireOwnedTask(taskId, userId);
  }

  async update(taskId: number, userId: number, dto: UpdateTaskDto) {
    await this.requireOwnedTask(taskId, userId);

    return this.prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        title: dto.title,
        description: dto.description,
        completed: dto.completed,
      },
    });
  }

  async remove(taskId: number, userId: number) {
    await this.requireOwnedTask(taskId, userId);

    await this.prisma.task.delete({
      where: {
        id: taskId,
      },
    });

    return {
      message: 'Görev silindi',
    };
  }
}
