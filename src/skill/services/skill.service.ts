import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Skill, SkillDocument } from 'src/skill/entities/skill.entity';

import * as DTO from 'src/skill/dto/skill.dto';

@Injectable()
export class SkillService {
  constructor(@InjectModel(Skill.name) private skillModel: Model<SkillDocument>) {}

  public async addSkill(payload: DTO.AddSkillRequestDto): Promise<SkillDocument> {
    return await this.skillModel.create(payload);
  }
}
