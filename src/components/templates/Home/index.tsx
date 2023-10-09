import BorderdButton from "@/components/common/BorderdButton";
import { useSignOut } from "./logic";

const HomeTemplate = () => {
  const { handlePress } = useSignOut();

  return (
    <div>
      <h1>Home</h1>
      <BorderdButton onPress={handlePress}>ログアウト</BorderdButton>
    </div>
  );
};

export default HomeTemplate;
