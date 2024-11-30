const BlogCard = ({ title, content }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`relative bg-white rounded-lg shadow-lg p-6 transition-transform duration-300 border-4 ${
        isExpanded ? 'border-green-500' : 'border-blue-400'
      } cursor-pointer h-64 overflow-hidden`}
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        transformOrigin: 'center',
        padding: '1.5rem', // Adjust padding for better border spacing
      }}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={`text-gray-700 ${isExpanded ? '' : 'truncate'}`}>
        {content}
      </p>
      {isExpanded && (
        <p className="text-sm mt-4 text-green-600">
          Click to collapse the full blog.
        </p>
      )}
    </div>
  );
};
