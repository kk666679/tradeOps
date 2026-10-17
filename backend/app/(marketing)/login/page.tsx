import Link from "next/link";
export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-black/60 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>
        <form className="space-y-4">
          <input type="email" placeholder="Email" className="w-full p-3 rounded-xl border dark:border-slate-700 bg-transparent" />
          <input type="password" placeholder="Password" className="w-full p-3 rounded-xl border dark:border-slate-700 bg-transparent" />
          <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium">Sign In</button>
        </form>
        <p className="text-center mt-4 text-sm text-slate-500">Don&apos;t have an account? <Link href="/register" className="text-blue-600 font-medium">Sign up</Link></p>
      </div>
    </div>
  );
}
