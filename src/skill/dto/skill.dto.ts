import { IsMongoId, IsOptional, IsString } from 'class-validator';
import * as PROTO from 'src/common/dto/proto/auth.pb';

export class AddSkillCategoryRequestDto implements PROTO.AddSkillCategoryRequest {
  @IsString()
  public readonly name: string;

  @IsString()
  public readonly description: string;
}

export class AddSkillRequestDto implements PROTO.AddSkillRequest {
  @IsString()
  public readonly name: string;

  @IsString()
  public readonly description: string;

  @IsMongoId()
  @IsOptional()
  public readonly category?: string;
}
