import { IsUUID, IsNotEmpty, IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProjectInvitationDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  role: string;
}

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  @IsString()
  role: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateProjectInvitationDto)
  invitation?: CreateProjectInvitationDto[];
}
