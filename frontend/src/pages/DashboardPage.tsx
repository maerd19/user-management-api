import { useAuthStore } from '../store/authStore';
import { Card } from '../components/ui';

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile</h3>
          <p className="text-gray-600 text-sm mb-4">View and edit your profile information</p>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Email:</span> {user?.email}
            </div>
            <div>
              <span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}
            </div>
            <div>
              <span className="font-medium">Member since:</span>{' '}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <p className="text-gray-600 text-sm mb-4">Manage your account</p>
          <div className="space-y-2">
            <a
              href="/profile"
              className="block text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Edit Profile →
            </a>
            <a
              href="/users"
              className="block text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Users →
            </a>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Status</h3>
          <p className="text-gray-600 text-sm mb-4">Your account information</p>
          <div className="flex items-center justify-center h-20">
            <div className="text-center">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ✓ Active
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="text-sm text-gray-600">
          <p>Last login: {new Date().toLocaleString()}</p>
        </div>
      </Card>
    </div>
  );
};
