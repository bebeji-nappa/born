import { trpc } from '@/utils/trpc';

export default function TopTemplate() {
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
