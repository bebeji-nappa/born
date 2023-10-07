import { trpc } from '@/utils/trpc';

export default function IndexPage() {
  const hello = trpc.hello.useQuery({ text: 'world' });

  const { data } = trpc.getAllUsers.useQuery();
  if (!hello.data) {  
    return <div>Loading...</div>;
  }

  return (
    <div>
      <ul>
        {data?.users.map((user) => 
          <li key={user.id}>{user.name}</li>
        )}
      </ul>
    </div>
  );
}
