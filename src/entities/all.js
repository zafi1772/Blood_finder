// Simple in-memory mock data & query helpers to satisfy imports in components
const donors = [
  {
    id: 'donor-1',
    name: 'John Doe',
    bloodType: 'A+',
    verified: true,
    location: { coordinates: [77.5946, 12.9716] },
    lastDonationDate: '2023-06-01',
  },
];

const receiverRequests = [
  {
    id: 'req-1',
    requesterId: 'user-1',
    requesterName: 'Jane Doe',
    requesterPhone: '+1234567890',
    bloodType: 'A+',
    unitsNeeded: 2,
    radiusMeters: 5000,
    status: 'open',
    created_date: new Date().toISOString(),
    urgency: 'routine',
  },
];

export const Donor = {
  async all() {
    return donors;
  },
};

export const ReceiverRequest = {
  async filter(/* criteria */) {
    // Return full list for now
    return receiverRequests;
  },
};

export const Match = {
  // Placeholder
};
