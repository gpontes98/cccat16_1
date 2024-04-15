export interface StartRideInputDTO {
    rideId: string;
    passengerId: string;
    driverId: string | null;
    status: string;
    fare: number;
    distance: number;
    from: {
        latitude: number;
        longitude: number;
    }
    to: {
        latitude: number;
        longitude: number; 
    },
    date: Date
}
