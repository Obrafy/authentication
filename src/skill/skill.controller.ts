import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SkillService } from 'src/skill/services/skill.service';

import * as PROTO from 'src/common/dto/proto/auth.pb';
import * as DTO from 'src/skill/dto/skill.dto';

import makeResponse from 'src/common/helpers/make-response';

@Controller()
export class SkillController {
  @Inject(SkillService) private readonly service: SkillService;

  // Skill Category Management
  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'AddSkillCategory')
  private async addSkillCategory(payload: DTO.AddSkillCategoryRequestDto): Promise<PROTO.AddSkillCategoryResponse> {
    const { _id: skillCategoryId } = await this.service.addSkillCategory(payload);

    return makeResponse<PROTO.AddSkillCategoryResponse>({ skillCategoryId });
  }

  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'FindSkillCategoryById')
  private async findSkillCategoryById(
    payload: DTO.FindSkillCategoryByIdRequestDto,
  ): Promise<PROTO.FindSkillCategoryByIdResponse> {
    const skillCategory = await this.service.findSkillCategoryById(payload);

    return makeResponse<PROTO.FindSkillCategoryByIdResponse>({
      skillCategory: {
        id: skillCategory._id,
        name: skillCategory.name,
        description: skillCategory.description,
        status: skillCategory.status,
        // Casting dates to integer for gRPC
        createdAt: skillCategory.createdAt.getTime(),
        updatedAt: skillCategory.updatedAt.getTime(),
      },
    });
  }

  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'FindSkillCategoryByName')
  private async findSkillCategoryByName(
    payload: DTO.FindSkillCategoryByNameRequestDto,
  ): Promise<PROTO.FindSkillCategoryByNameResponse> {
    const skillCategory = await this.service.findSkillCategoryByName(payload);

    return makeResponse<PROTO.FindSkillCategoryByNameResponse>({
      skillCategory: {
        id: skillCategory._id,
        name: skillCategory.name,
        description: skillCategory.description,
        status: skillCategory.status,
        // Casting dates to integer for gRPC
        createdAt: skillCategory.createdAt.getTime(),
        updatedAt: skillCategory.updatedAt.getTime(),
      },
    });
  }

  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'FindAllSkillCategories')
  private async findAllSkillCategories(
    payload: DTO.FindAllSkillCategoriesRequestDto,
  ): Promise<PROTO.FindAllSkillCategoriesResponse> {
    const skillCategories = (await this.service.findAllSkillCategories(payload)).map((sc) => ({
      id: sc._id,
      name: sc.name,
      description: sc.description,
      status: sc.status,
      // Casting dates to integer for gRPC
      createdAt: sc.createdAt.getTime(),
      updatedAt: sc.updatedAt.getTime(),
    }));

    return makeResponse<PROTO.FindAllSkillCategoriesResponse>({
      skillCategories,
    });
  }

  // Skill Management
  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'AddSkill')
  private async addSkill(payload: DTO.AddSkillRequestDto): Promise<PROTO.AddSkillResponse> {
    const { _id: skillId } = await this.service.addSkill(payload);

    return makeResponse<PROTO.AddSkillResponse>({ skillId });
  }
}
