"use client";

import { useCallback, useEffect, useState } from "react";

import { BeatLoader } from "react-spinners";
import FormError from "@/components/form-error";
import FormSuccess from "@/components/form-success";
import Link from "next/link";
import { newVerification } from "@/actions/new-verification";
import { useSearchParams } from "next/navigation";

export default function NewVerification() {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Missing token!");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    onSubmit();
  }, [onSubmit]);

  return (
    <section className="flex flex-col gap-2 bg-white m-4 p-16 rounded-2xl">
      <div className="flex flex-col items-center gap-4 rounded-2xl w-96">
        <h1 className="font-extrabold text-2xl text-center">
          Confirming your verification
        </h1>
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
        <Link href="/auth/login" className="btn btn-primary">
          Back to Login
        </Link>
      </div>
    </section>
  );
}
