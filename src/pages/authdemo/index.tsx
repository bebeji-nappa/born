import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function AuthDemo() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <>
          <Image src={session.user?.image!} alt="icon" width={400} height={400} />
          <h1>Signed in as {session.user?.name}</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </>
  );
};
