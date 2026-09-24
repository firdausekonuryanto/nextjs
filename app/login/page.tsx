import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="mx-auto mt-10 max-w-sm">
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-xl font-bold text-white">
            T
          </div>
          <h1 className="text-xl font-bold">Masuk ke Toko Kecil</h1>
          <p className="mt-1 text-sm text-slate-500">
            Silakan login untuk melanjutkan
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
