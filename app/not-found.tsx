import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist or has been moved.</p>
        <Link href="/" className="btn-primary">Go to Homepage</Link>
      </div>
    </div>
  );
}
