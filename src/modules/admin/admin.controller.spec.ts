import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AdminContentService } from './admin-content.service';
import { AdminContentRequestService } from './admin-content-request.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role } from '../../common/enums/role.enum';
import { Type } from '@nestjs/common';

describe('AdminController', () => {
  let controller: AdminController;

  beforeEach(async () => {
    const mockAdminService = {};
    const mockAdminContentService = {};
    const mockAdminContentRequestService = {};

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        { provide: AdminService, useValue: mockAdminService },
        { provide: AdminContentService, useValue: mockAdminContentService },
        {
          provide: AdminContentRequestService,
          useValue: mockAdminContentRequestService,
        },
      ],
    }).compile();

    controller = module.get<AdminController>(AdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should have Admin role requirement', () => {
    const roles = Reflect.getMetadata('roles', AdminController) as Role[];
    expect(roles).toContain(Role.ADMIN);
  });

  it('should use JwtAuthGuard and RolesGuard', () => {
    const guards = Reflect.getMetadata(
      '__guards__',
      AdminController,
    ) as Type<unknown>[];
    expect(guards).toContain(JwtAuthGuard);
    expect(guards).toContain(RolesGuard);
  });
});
