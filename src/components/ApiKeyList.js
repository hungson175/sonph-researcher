import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function ApiKeyList({ apiKeys, visibleKeys, toggleKeyVisibility, handleCopyKey, openEditModal, handleDeleteKey }) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          <th className="py-2">NAME</th>
          <th className="py-2">USAGE</th>
          <th className="py-2">KEY</th>
          <th className="py-2">OPTIONS</th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((key) => (
          <tr key={key.id} className="border-t">
            <td className="py-2">{key.name || 'default'}</td>
            <td className="py-2">
              <UsageCircle usage={40} />
            </td>
            <td className="py-2">
              <div className="bg-gray-100 p-2 rounded">
                {visibleKeys[key.id] ? key.value : `${key.value.slice(0, 4)}-********************`}
              </div>
            </td>
            <td className="py-2 flex space-x-2">
              {visibleKeys[key.id] ? (
                <EyeSlashIcon onClick={() => toggleKeyVisibility(key.id)} className="h-5 w-5 text-gray-500 cursor-pointer" />
              ) : (
                <EyeIcon onClick={() => toggleKeyVisibility(key.id)} className="h-5 w-5 text-gray-500 cursor-pointer" />
              )}
              <ClipboardDocumentIcon onClick={() => handleCopyKey(key.value)} className="h-5 w-5 text-gray-500 cursor-pointer" />
              <PencilSquareIcon onClick={() => openEditModal(key)} className="h-5 w-5 text-gray-500 cursor-pointer" />
              <TrashIcon onClick={() => handleDeleteKey(key.id)} className="h-5 w-5 text-red-500 cursor-pointer" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function UsageCircle({ usage }) {
  return (
    <div className="relative w-8 h-8">
      <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 36 36">
        <path
          className="text-gray-200"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          className="text-green-500"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeDasharray={`${usage}, 100`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs">{usage}%</div>
    </div>
  );
}