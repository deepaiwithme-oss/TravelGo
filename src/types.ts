export interface Route {
  id: string;
  from: string;
  to: string;
  dailyBuses: number;
  price: number;
}

export interface Bus {
  id: string;
  operator: string;
  operatorLogo: string;
  type: string;
  rating: number;
  departureTime: string;
  departureCity: string;
  arrivalTime: string;
  arrivalCity: string;
  duration: string;
  amenities: string[];
  seatsLeft: number;
  price: number;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  code?: string;
  image: string;
  badge: string;
  bgGradient: string;
  price?: string;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  type: 'booking' | 'bonus' | 'topup' | 'refund';
  amount: number; // positive for credit, negative for debit
  status: 'Success' | 'Credited' | 'Failed' | 'Pending';
}

export interface Booking {
  id: string;
  bus: Bus;
  seatNumbers: string[];
  boardingPoint: string;
  droppingPoint: string;
  date: string;
  passengers: string[];
  totalPrice: number;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  qrCode: string;
}

export interface Passenger {
  id: string;
  name: string;
  initials: string;
  bgClass: string;
  textClass: string;
}
