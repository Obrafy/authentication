import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import * as EXCEPTIONS from '@nestjs/common/exceptions';

import { Model, FilterQuery } from 'mongoose';

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

  /**
   * Get all skill categories
   * @returns An array of SkillCategory object
   */
  private async _getAllSkillCategories(): Promise<SkillCategoryDocument[]> {
    return this.skillCategoryModel.find({ status: { $ne: Status.DELETED } });
  }

  /**
   * Get a skill  by id
   * @param skillId The Skill's id
   * @returns The Skill object
   */
  private async _getSkillById(skillId: string): Promise<SkillDocument> {
    return this.skillModel.findOne({ _id: skillId, status: { $ne: Status.DELETED } });
  }

  /**
   * Get a skill  by name
   * @param skillName The Skill's name
   * @returns The Skill object
   */
  private async _getSkillByName(skillName: string): Promise<SkillDocument> {
    return this.skillModel.findOne({ name: skillName, status: { $ne: Status.DELETED } });
  }

  /**
   * Get all skills
   * @returns An array of Skill objects
   */
  private async _getAllSkills(filter: FilterQuery<SkillDocument> = {}): Promise<SkillDocument[]> {
    return this.skillModel.find({ status: { $ne: Status.DELETED }, ...filter });
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

  /**
   * Find a skillCategory by it's name
   * @param param.skillCategoryName The SkillCategory's name
   * @returns The SkillCategory object
   */
  public async findAllSkillCategories(_: DTO.FindAllSkillCategoriesRequestDto): Promise<SkillCategoryDocument[]> {
    const skillCategories = await this._getAllSkillCategories();

    return skillCategories;
  }

  // Skill Management

  public async addSkill(payload: DTO.AddSkillRequestDto): Promise<SkillDocument> {
    return await this.skillModel.create(payload);
  }

  /**
   * Find a skill by it's id
   * @param param.skillId The Skill's id
   * @returns The Skill object
   */
  public async findSkillById({ skillId }: DTO.FindSkillByIdRequestDto): Promise<SkillDocument> {
    const skill = await this._getSkillById(skillId);

    if (!skill) throw new EXCEPTIONS.NotFoundException(SKILL_ERROR_MESSAGES_KEYS.SKILL_NOT_FOUND);

    return skill;
  }

  /**
   * Find a skill by it's name
   * @param param.skillName The Skill's name
   * @returns The Skill object
   */
  public async findSkillByName({ skillName }: DTO.FindSkillByNameRequestDto): Promise<SkillDocument> {
    const skill = await this._getSkillByName(skillName);

    if (!skill) throw new EXCEPTIONS.NotFoundException(SKILL_ERROR_MESSAGES_KEYS.SKILL_NOT_FOUND);

    return skill;
  }

  /**
   * Find all skills
   * @returns The Skill object
   */
  public async findAllSkills(_: DTO.FindAllSkillsRequestDto): Promise<SkillDocument[]> {
    return await this._getAllSkills();
  }
}
