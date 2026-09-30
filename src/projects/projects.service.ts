import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto } from './dto/create-project.dto.js';
import { UpdateProjectDto } from './dto/update-project.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: number, dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        ownerId: userId,
      },
    });
  }

  findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(projectId: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
      include: {
        tasks: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Proje bulunamadı');
    }

    return project;
  }

  async update(projectId: number, userId: number, dto: UpdateProjectDto) {
    await this.findOne(projectId, userId);

    return this.prisma.project.update({
      where: {
        id: projectId,
      },
      data: {
        name: dto.name,
        description: dto.description,
      },
    });
  }

  async remove(projectId: number, userId: number) {
    await this.findOne(projectId, userId);

    await this.prisma.project.delete({
      where: {
        id: projectId,
      },
    });

    return {
      message: 'Proje silindi',
    };
  }
}
