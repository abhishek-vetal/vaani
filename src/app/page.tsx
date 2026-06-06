import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <OrganizationSwitcher />
      <UserButton />
    </div>
  );
}
