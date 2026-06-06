import { OrganizationList } from "@clerk/nextjs";

export default function OrganizationListPage() {
  return (
    <OrganizationList
      hidePersonal
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
    />
  );
}
