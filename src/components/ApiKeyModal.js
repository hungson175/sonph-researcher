export default function ApiKeyModal({ isOpen, onClose, onSubmit, keyName, setKeyName, limitUsage, setLimitUsage, usageLimit, setUsageLimit, isEdit = false }) {
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit API key' : 'Create a new API key'}</h2>
        <p className="mb-4">Enter a name and limit for the API key.</p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Key Name</label>
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="Key Name"
          />
        </div>
        {!isEdit && (
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={limitUsage}
                onChange={(e) => setLimitUsage(e.target.checked)}
                className="mr-2"
              />
              Limit monthly usage
            </label>
            {limitUsage && (
              <input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                className="border p-2 w-full rounded mt-2"
                placeholder="1000"
              />
            )}
          </div>
        )}
        <p className="text-sm text-gray-500 mb-4">
          * If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
        </p>
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 rounded">
            Cancel
          </button>
          <button onClick={onSubmit} className="bg-blue-500 text-white p-2 rounded">
            {isEdit ? 'Save' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}