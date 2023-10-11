import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const HomeTemplate = () => {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Home</h1>
      {session && (
        <>
          <Image src={session.user?.image!} alt="icon" width={400} height={400} />
          <h1>Signed in as {session.user?.name}</h1>
          <button onClick={() => signOut({ callbackUrl: '/sign_in' })}>Sign out</button>
        </>
      )}
    </div>
  );
};

export default HomeTemplate;
