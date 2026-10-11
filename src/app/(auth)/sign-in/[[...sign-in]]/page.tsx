import { SignIn } from "@clerk/nextjs";
import { authAppearance } from "../../auth-appearance";

export default function Page() {
  return <SignIn appearance={authAppearance} />;
}