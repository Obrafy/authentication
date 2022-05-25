import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SkillService } from 'src/skill/services/skill.service';
import { SkillController } from 'src/skill/skill.controller';
import { Skill, SkillSchema } from 'src/skill/entities/skill.entity';

@Module({
  controllers: [SkillController],
  providers: [SkillService],
  imports: [MongooseModule.forFeature([{ name: Skill.name, schema: SkillSchema }])],
})
export class SkillModule {}
