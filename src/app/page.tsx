import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <main className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to BMI Web App</h1>
        <p className="text-gray-600 mb-8">
          Track your BMI history and health progress easily.
        </p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300 transition"
          >
            Register
          </Link>
        </div>
      </main>
    </div>
  );
}
