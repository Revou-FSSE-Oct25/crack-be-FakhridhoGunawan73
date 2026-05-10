import { IsDateString, IsInt, IsOptional, IsNotEmpty, IsString } from "class-validator";

export class CreateBookingDto {
    @IsNotEmpty()
    @IsInt()
    roomId!: number;

    @IsDateString()
    @IsNotEmpty()
    startDate!: string;

    @IsDateString()
    @IsNotEmpty()
    endDate!: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
