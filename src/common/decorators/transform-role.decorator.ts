import { Transform } from 'class-transformer';
import { Role as InternalRoleEnum } from 'src/auth/entities/role.enum';
import { Role as ProtoRoleEnum } from 'src/auth/dto/proto/auth.pb';

export const TransformRoleEnum = () => Transform(({ value }) => InternalRoleEnum[ProtoRoleEnum[value]]);
