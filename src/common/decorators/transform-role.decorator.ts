import { Transform } from 'class-transformer';
import { Role as InternalRoleEnum } from 'src/auth/entities/role.enum';
import { Role as ProtoRoleEnum } from 'src/common/dto/proto/auth.pb';

const TransformEnums = <T, G>(OuterEnum: T, InnerEnum: G) =>
  Transform(({ value }) => {
    if (Array.isArray(value)) {
      const transformedArray = [];
      for (const v of value) {
        transformedArray.push(OuterEnum[InnerEnum[v]]);
      }

      return transformedArray;
    }

    return OuterEnum[InnerEnum[value]];
  });

export const TransformRoleEnum = () => TransformEnums(InternalRoleEnum, ProtoRoleEnum);
