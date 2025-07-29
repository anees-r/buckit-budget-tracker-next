import AuthGate from "@/components/AuthGate";

export default function Home() {
  return (
    <>
    <div className="relative h-screen w-full flex flex-col justify-center items-center">
      <AuthGate/>
    </div>
    </>
  );
}
