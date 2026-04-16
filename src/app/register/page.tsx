import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md rounded-lg border bg-white p-6">
      <h1 className="mb-4 text-2xl font-bold">Register</h1>
      <RegisterForm />
      <p className="mt-4 text-sm text-zinc-600">
        Have an account? <Link href="/login" className="text-violet-700">Login</Link>
      </p>
    </div>
  );
}
