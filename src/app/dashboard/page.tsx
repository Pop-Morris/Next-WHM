import DashboardContent from '../components/DashboardContent';

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Webhook Dashboard</h1>
        <p className="text-gray-600">Manage your BigCommerce webhooks</p>
      </div>
      <DashboardContent />
    </main>
  );
} 