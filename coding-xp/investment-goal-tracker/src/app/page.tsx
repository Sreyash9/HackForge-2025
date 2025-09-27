
import { auth } from "@/lib/firebase";
import { redirect } from "next/navigation";
import { AuthLoader } from "@/components/auth/auth-loader";


export default function Home() {
  if (auth.currentUser) {
    redirect("/dashboard");
  }

  return (
    <main
      className="flex min-h-screen w-full items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://storage.googleapis.com/aifirebase/images/8ed75097-f509-4a0b-99f6-6c1f19d26615.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="z-10">
        <AuthLoader />
      </div>
    </main>
  );
}

