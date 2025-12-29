// Base interfaces
export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    image?: string;
    apartmentNumber?: string;
}

export interface Vehicle {
    _id: string;
    vehicleModel: string;
    vehicleNumber: string;
    color?: string;
    parkingArea?: string;
    parkingNumber?: string;
    userId: string;
}

export interface Building {
    _id: string;
    buildingName: string;
    address: string;
    area: string;
    city: string;
    state?: string;
    zipCode?: string;
}

export interface Package {
    _id: string;
    name: string;
    description: string;
    price: number;
    frequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'One-time';
    duration: number; // in months
    totalSessions: number;
    services: string[];
}

export interface Session {
    _id: string;
    date: string | null;
    startTime?: string;
    endTime?: string;
    isCompleted: boolean;
    completedAt?: string;
    completedBy?: string;
    notes?: string;
    images?: string[];
}

export interface Cleaner {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    status: 'Available' | 'Busy' | 'On Leave';
    specialization?: string[];
    rating?: number;
    totalJobs?: number;
}

export interface Payment {
    _id: string;
    amount: number;
    status: 'Pending' | 'Completed' | 'Failed' | 'Refunded';
    method: 'Credit Card' | 'Debit Card' | 'Bank Transfer' | 'Cash';
    transactionId?: string;
    paidAt?: string;
    invoiceUrl?: string;
}

// Package Booking interface
export interface PackageBooking {
    _id: string;
    packageId: Package;
    price: number;
    totalSessions: number;
    sessions: Session[];
    startDate: string;
    endDate: string;
    status: 'Active' | 'Completed' | 'Cancelled' | 'On Hold';
    discountApplied?: number;
}

// Addon Booking interface
export interface AddonBooking {
    _id: string;
    addonId: {
        _id: string;
        name: string;
        description: string;
        price: number;
    };
    price: number;
    totalSessions: number;
    sessions: Session[];
    status: 'Active' | 'Completed' | 'Cancelled';
}

// Main Booking interface
export interface BookingData {
    _id: string;
    bookingId: string;
    userId: User;
    vehicleId: Vehicle;
    buildingId: Building;
    package: PackageBooking;
    addons?: AddonBooking[];
    cleanersAssigned?: Cleaner[];
    totalPrice: number;
    payment: Payment;
    bookingType: 'Package' | 'Add-on' | 'Custom';
    status: 'Pending' | 'Confirmed' | 'Assigned' | 'In Progress' | 'Completed' | 'Cancelled';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
    specialInstructions?: string;
}

// API Response interface
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    error?: string;
}

// Filter/Search interfaces
export interface BookingFilters {
    status?: string[];
    dateRange?: {
        start: string;
        end: string;
    };
    buildingId?: string;
    cleanerId?: string;
    search?: string;
}

// Stats interfaces
export interface BookingStats {
    total: number;
    completed: number;
    pending: number;
    cancelled: number;
    inProgress: number;
    revenue: number;
    avgCompletionTime: number;
}

// Timeline interface
export interface BookingTimelineEvent {
    id: string;
    type: 'status_change' | 'payment' | 'session_completed' | 'note_added' | 'cleaner_assigned';
    title: string;
    description?: string;
    timestamp: string;
    user?: {
        name: string;
        role: string;
    };
    metadata?: Record<string, any>;
}

// Invoice interface
export interface Invoice {
    id: string;
    bookingId: string;
    customer: {
        name: string;
        email: string;
        phone?: string;
        address: string;
    };
    items: {
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    dueDate: string;
    paidDate?: string;
    paymentMethod: string;
    notes?: string;
}

// Session Form interface (for editing/creating sessions)
export interface SessionFormData {
    date: string;
    startTime: string;
    endTime: string;
    cleanerId: string;
    notes?: string;
}

// Booking Update interface
export interface BookingUpdateData {
    status?: string;
    cleanerIds?: string[];
    notes?: string;
    specialInstructions?: string;
    addons?: string[];
}

// Export all types
