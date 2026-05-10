import { IsBoolean, IsInt, IsNotEmpty, IsString, IsOptional, Min } from "class-validator";

export class CreateRoomDto {
    @IsInt()
    kosId!: number;
    
    @IsString()
    @IsNotEmpty()
    roomNumber!: string;

    @IsInt()
    @Min(0)
    price!: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    capacity?: number;

    @IsString()
    @IsOptional()
    facilities?: string;

    @IsString()
    @IsOptional()
    imageUrl?: string;

    @IsBoolean()
    @IsOptional()
    isAvailable?: boolean;
}
