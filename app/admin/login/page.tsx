import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Card, CardContent } from "@/components/ui/card";

function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md animate-pulse border-border/80">
        <CardContent className="h-64 p-6" />
      </Card>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
