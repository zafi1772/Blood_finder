export function createPageUrl(pageName) {
  // Simple mapping between human readable names and routes
  const map = {
    FindBlood: '/find-blood',
    DonorDashboard: '/donor-dashboard',
    MyRequests: '/my-requests',
    AdminPanel: '/admin',
  };
  return map[pageName] || '/';
}
