export class CreateMenuItemDto {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
}

export class UpdateMenuItemDto {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}