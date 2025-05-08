import { Suspense } from "react";
import LoginForm from "./_component/Login";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading login form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
