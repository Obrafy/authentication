import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { SkillService } from 'src/skill/services/skill.service';

import * as PROTO from 'src/common/dto/proto/auth.pb';
import * as DTO from 'src/skill/dto/skill.dto';

import makeResponse from 'src/common/helpers/make-response';

@Controller()
export class SkillController {
  @Inject(SkillService) private readonly service: SkillService;

  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'AddSkillCategory')
  private async addSkillCategory(payload: DTO.AddSkillCategoryRequestDto): Promise<PROTO.AddSkillCategoryResponse> {
    const { _id: skillCategoryId } = await this.service.addSkillCategory(payload);

    return makeResponse<PROTO.AddSkillCategoryResponse>({ skillCategoryId });
  }

  @GrpcMethod(PROTO.SKILL_MANAGEMENT_SERVICE_NAME, 'AddSkill')
  private async addSkill(payload: DTO.AddSkillRequestDto): Promise<PROTO.AddSkillResponse> {
    const { _id: skillId } = await this.service.addSkill(payload);

    return makeResponse<PROTO.AddSkillResponse>({ skillId });
  }
}
