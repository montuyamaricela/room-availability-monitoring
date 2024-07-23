import { getServerSession } from "next-auth";
import Map from "~/components/common/Map";
import { authOptions } from "~/server/auth";

// Home page
export default async function Page() {
  const session = await getServerSession(authOptions);
  console.log(session);
  return <Map />;
}
