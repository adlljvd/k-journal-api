import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Login</h1>
      <LoginForm />
      <p className="mt-4 text-sm text-zinc-600">
        No account? <Link href="/register" className="text-violet-700">Register</Link>
      </p>
    </div>
  );
}
