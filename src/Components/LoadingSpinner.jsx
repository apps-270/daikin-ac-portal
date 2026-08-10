export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative w-12 h-12">
        <div
          className="absolute inset-0 rounded-full border-4 border-blue-200"
          style={{
            animation: 'spin 3s linear infinite',
          }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500"
          style={{
            animation: 'spin 1s linear infinite',
          }}
        />
      </div>
    </div>
  );
}
