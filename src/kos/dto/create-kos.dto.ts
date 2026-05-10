import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateKosDto {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    address!: string;

    @IsNotEmpty()
    @IsString()
    city!: string;

    @IsString()
    @IsOptional()
    description!: string;
}
