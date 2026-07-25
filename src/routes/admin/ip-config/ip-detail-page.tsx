import { useParams } from "react-router-dom";
import IpDetail from "~/components/admin/ip-detail";

const IpDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  if (!id) return null;

  return <IpDetail ipId={id} />;
};

export default IpDetailPage;
