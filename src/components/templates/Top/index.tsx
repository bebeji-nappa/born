import { trpc } from '@/utils/trpc';

const TopTemplate = () => {
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

export default TopTemplate;
