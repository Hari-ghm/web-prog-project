'use client';

import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Create an Account
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Join EnerGrid to start monitoring your energy
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label htmlFor="first-name" className="sr-only">First Name</label>
                <input
                    id="first-name"
                    name="first-name"
                    type="text"
                    required
                    className="relative block w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 placeholder-slate-500 text-white focus:z-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                    placeholder="First Name"
                />
                </div>
                <div>
                <label htmlFor="last-name" className="sr-only">Last Name</label>
                <input
                    id="last-name"
                    name="last-name"
                    type="text"
                    required
                    className="relative block w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 placeholder-slate-500 text-white focus:z-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                    placeholder="Last Name"
                />
                </div>
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 placeholder-slate-500 text-white focus:z-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="relative block w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 placeholder-slate-500 text-white focus:z-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.5)]"
            >
              Sign up
            </button>
          </div>
          
          <div className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
