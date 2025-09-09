import UserDonationRequests from "./user-donation-requests";
import NewDonationRequest from "./new-donation-request";
import NearbyDonationRequests from "./nearby-donation-requests";

export default function RequestsTab() {
    return (
        <div className="space-y-6">
            <NewDonationRequest />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UserDonationRequests />

                <NearbyDonationRequests />
            </div>
        </div>
    );
}
