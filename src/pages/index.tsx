import { trpc } from '@/utils/trpc';

export default function IndexPage() {
  const { data } = trpc.getAllUsers.useQuery();

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
