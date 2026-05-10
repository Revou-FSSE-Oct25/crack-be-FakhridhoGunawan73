import { IsInt, IsOptional, IsBoolean, IsString, Min } from "class-validator";

export class UpdateRoomDto {
    @IsString()
    @IsOptional()
    roomNumber?: string;

    @IsInt()
    @Min(0)
    @IsOptional()
    price?: number;

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
