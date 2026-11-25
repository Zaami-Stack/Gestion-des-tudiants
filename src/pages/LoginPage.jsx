import { Link } from "react-router-dom";
import { HiAcademicCap } from "react-icons/hi2";

export default function LoginPage() {
  return (
    <main className="relative grid min-h-screen grid-cols-[34px_minmax(0,430px)_34px] justify-center text-white tracking-tighter max-[520px]:grid-cols-[20px_minmax(0,1fr)_20px]">
      <div
        className="border-x border-slate-400/10 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgb(148_163_184_/_12%)_4px,rgb(148_163_184_/_12%)_5px)]"
        aria-hidden="true"
      />
      <section className="box-border flex items-center p-10 max-[520px]:p-6">
        <form className="w-full">
          <div className="mb-10 text-2xl">
            <Link
              className="flex items-center gap-2 font-light tracking-tighter"
              to="/"
            >
              <HiAcademicCap className="mb-1" />
              <span className="text-[#00BCFF]">
                <span className="text-white">Edu</span>Flow
              </span>
            </Link>
          </div>
          <div className="w-full">
            <label className="text-[15px]" htmlFor="email">
              Email
            </label>
            <input
              className="mt-1 mb-5 block h-10 w-full rounded border border-gray-500 bg-[#10141E] ps-4"
              type="text"
              id="email"
            />

            <label className="text-[15px]" htmlFor="password">
              Password
            </label>
            <input
              className="mt-1 block h-10 w-full rounded border border-gray-500 bg-[#10141E] ps-4"
              type="text"
              id="password"
            />

            <input
              className="my-9 text-[14px] hover:bg-gray-800 h-8 w-full cursor-pointer rounded-2xl bg-[#364153]"
              type="submit"
              value="Se connecter"
            />
          </div>
        </form>
      </section>
      <div
        className="border-x border-slate-400/10 bg-[repeating-linear-gradient(135deg,transparent_0,transparent_4px,rgb(148_163_184_/_12%)_4px,rgb(148_163_184_/_12%)_5px)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-1/4 border-t border-slate-400/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-[70%] border-t border-slate-400/10"
        aria-hidden="true"
      />
    </main>
  );
}
