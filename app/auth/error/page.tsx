import Link from "next/link";

export default function AuthError() {
  return (
    <div className="flex flex-col justify-center items-center gap-2 shadow-md p-8 w-96 text-center">
      <h1 className="font-extrabold text-4xl">Oops! Something went wrong!</h1>
      <Link href="/auth/login" className="btn btn-primary">
        Back to Login
      </Link>
    </div>
  );
}
