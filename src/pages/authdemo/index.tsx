import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthDemo() {
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <button onClick={() => signOut()}>Sign out</button>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </>
  );
};
