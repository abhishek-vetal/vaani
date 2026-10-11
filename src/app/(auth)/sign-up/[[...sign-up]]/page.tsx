import { SignUp } from "@clerk/nextjs";
import { authAppearance } from "../../auth-appearance";

export default function Page() {
  return <SignUp appearance={authAppearance} />;
}