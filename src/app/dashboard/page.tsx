import DashboardContent from '../components/DashboardContent';

function DocumentationPanel() {
  const docs = [
    {
      title: "Webhook Overview",
      description: "Learn about BigCommerce webhooks and how to use them",
      url: "https://developer.bigcommerce.com/docs/integrations/webhooks"
    },
    {
      title: "Webhook Events",
      description: "Explore all available webhook events and their payloads",
      url: "https://developer.bigcommerce.com/docs/integrations/webhooks/events"
    },
    {
      title: "Webhook Management",
      description: "Detailed guide on creating and managing webhooks",
      url: "https://developer.bigcommerce.com/docs/webhooks/webhooks/manage-webhooks-single#create-a-webhook"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          Developer Resources
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {docs.map((doc, index) => (
          <a
            key={index}
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  {doc.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {doc.description}
                </p>
              </div>
              <svg 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                />
              </svg>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 pb-8 pt-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Webhook Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Manage your BigCommerce webhooks
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <DashboardContent />
        
        {/* Documentation Section */}
        <div className="mt-12 max-w-3xl mx-auto">
          <DocumentationPanel />
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-gray-600">
            Made with{' '}
            <span className="text-red-500" aria-label="love">
              ❤️
            </span>
            {' '}by Mason & Josh
          </p>
        </div>
      </footer>
    </div>
  );
} 