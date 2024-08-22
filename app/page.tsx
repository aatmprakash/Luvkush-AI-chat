import Image from "next/image";
import ChatComponent from "@/components/chats";

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-14">
        <div className="artboard phone-3  bg-white card ">
          <ChatComponent />
        </div>
      </main>
    </>
  );
}
