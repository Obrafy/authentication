import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import * as EXCEPTIONS from '@nestjs/common/exceptions';

import { Model } from 'mongoose';

import { SKILL_ERROR_MESSAGES_KEYS } from 'src/common/error-messages/error-messages.interface';
import { Status } from 'src/common/dto/status.enum';
import * as DTO from 'src/skill/dto/skill.dto';
import { Skill, SkillDocument } from 'src/skill/entities/skill.entity';
import { SkillCategory, SkillCategoryDocument } from 'src/skill/entities/skill-category.entity';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill.name) private skillModel: Model<SkillDocument>,
    @InjectModel(SkillCategory.name) private skillCategoryModel: Model<SkillCategoryDocument>,
  ) {}

  // Private Methods

  /**
   * Get a skill category by id
   * @param skillCategoryId The SkillCategory's id
   * @returns The SkillCategory object
   */
  private async _getSkillCategoryById(skillCategoryId: string): Promise<SkillCategoryDocument> {
    return this.skillCategoryModel.findOne({ _id: skillCategoryId, status: { $ne: Status.DELETED } });
  }

  /**
   * Get a skill category by name
   * @param skillCategoryName The SkillCategory's name
   * @returns The SkillCategory object
   */
  private async _getSkillCategoryByName(skillCategoryName: string): Promise<SkillCategoryDocument> {
    return this.skillCategoryModel.findOne({ name: skillCategoryName, status: { $ne: Status.DELETED } });
  }

  // Public Methods
  // Skill Category Management

  /**
   * Create a new skillCategory
   * @param param.name The SkillCategory's name
   * @param param.description The SkillCategory's description
   * @returns The SkillCategory object
   */
  public async addSkillCategory(payload: DTO.AddSkillCategoryRequestDto): Promise<SkillCategoryDocument> {
    return await this.skillCategoryModel.create(payload);
  }

  /**
   * Find a skillCategory by it's id
   * @param param.skillCategoryId The SkillCategory's id
   * @returns The SkillCategory object
   */
  public async findSkillCategoryById({
    skillCategoryId,
  }: DTO.FindSkillCategoryByIdRequestDto): Promise<SkillCategoryDocument> {
    const skillCategory = await this._getSkillCategoryById(skillCategoryId);

    if (!skillCategory) throw new EXCEPTIONS.NotFoundException(SKILL_ERROR_MESSAGES_KEYS.SKILL_CATEGORY_NOT_FOUND);

    return skillCategory;
  }

  /**
   * Find a skillCategory by it's name
   * @param param.skillCategoryName The SkillCategory's name
   * @returns The SkillCategory object
   */
  public async findSkillCategoryByName({
    skillCategoryName,
  }: DTO.FindSkillCategoryByNameRequestDto): Promise<SkillCategoryDocument> {
    const skillCategory = await this._getSkillCategoryByName(skillCategoryName);

    if (!skillCategory) throw new EXCEPTIONS.NotFoundException(SKILL_ERROR_MESSAGES_KEYS.SKILL_CATEGORY_NOT_FOUND);

    return skillCategory;
  }

  // Skill Management

  public async addSkill(payload: DTO.AddSkillRequestDto): Promise<SkillDocument> {
    return await this.skillModel.create(payload);
  }
}
