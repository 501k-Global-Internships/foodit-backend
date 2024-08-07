export enum UserType {
  User = 'user',
  Admin = 'admin',
  Vendor = 'vendor',
  Moderator = 'moderator',
}

export enum StatusType {
  ACTIVATED = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

export enum DishCategory {
  Breakfast = 'Breakfast',
  Salad = 'Salad',
  Drinks = 'Drinks',
  Dessert = 'Dessert',
  Soup = 'Soup',
  Snacks = 'Snacks',
  African_Dishes = 'African Dishes',
}

export enum OrderStatus {
  PLACED = 'placed',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready for pickup',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}
