import { Transform } from 'class-transformer';
import { Role as InternalRoleEnum } from 'src/auth/entities/role.enum';
import { Role as ProtoRoleEnum } from 'src/auth/dto/proto/auth.pb';

const TransformEnums = <T, G>(OuterEnum: T, InnerEnum: G) => Transform(({ value }) => OuterEnum[InnerEnum[value]]);

export const TransformRoleEnum = () => TransformEnums(InternalRoleEnum, ProtoRoleEnum);
