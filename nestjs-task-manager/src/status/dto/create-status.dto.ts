import { IsEnum, IsNotEmpty, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { TaskStatus } from "src/tasks/task-status.enum";

@ValidatorConstraint({ name: 'isEnumOrString', async: false })
// export class IsEnumOrStringConstraint implements ValidatorConstraintInterface {
//   validate(value: any, args: ValidationArguments) {
//     return Object.values(TaskStatus).includes(value) || typeof value === 'string';
//   }

//   defaultMessage(args: ValidationArguments) {
//     return 'Value must be either a valid enum value or a string';
//   }
// }

export class CreateStatusDTO {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    color: string;
    // // @Validate(IsEnumOrStringConstraint)
    // status: TaskStatus | string;
}