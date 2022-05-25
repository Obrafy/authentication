import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import * as DTO from 'src/skill/dto/skill.dto';

import { Skill, SkillDocument } from 'src/skill/entities/skill.entity';
import { SkillCategory, SkillCategoryDocument } from 'src/skill/entities/skill-category.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
    @InjectModel(SkillCategory.name) private skillCategoryModel: Model<SkillCategoryDocument>,
  ) {}

  public async addSkillCategory(payload: DTO.AddSkillRequestDto): Promise<SkillDocument> {
    return await this.skillCategoryModel.create(payload);
  }

  public async addSkill(payload: DTO.AddSkillRequestDto): Promise<SkillDocument> {
    return await this.skillModel.create(payload);
  }
}
