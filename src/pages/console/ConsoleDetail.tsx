import { Link, useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, useDeleteApp } from "@/hooks/use-apps";
import DetailHeader from "@/components/console/detail/DetailHeader";
import GatewayUrlCard from "@/components/console/detail/GatewayUrlCard";
import GoLiveChecklist from "@/components/console/detail/GoLiveChecklist";
import DonationPopup from "@/components/console/DonationPopup";

const ConsoleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gw, isLoading, isError } = useApp(id);
  const deleteApp = useDeleteApp();

  const handleDelete = async () => {
    if (!gw) return;
    await deleteApp.mutateAsync(gw.id);
    navigate("/app");
  };

  if (isLoading) {
    return (
      <div className="section-container py-10 flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError || !gw) {
    return (
      <div className="section-container py-10 text-center">
        <p className="text-sm text-destructive mb-4">Gateway not found or failed to load.</p>
        <Link to="/app" className="text-sm text-primary hover:underline">Back to gateways</Link>
      </div>
    );
  }

  return (
    <div className="section-container py-10 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <DetailHeader gw={gw} />
        {gw.gatewayUrl && <GatewayUrlCard url={gw.gatewayUrl} />}
        <GoLiveChecklist gw={gw} onDelete={handleDelete} isDeleting={deleteApp.isPending} />
      </motion.div>
      <DonationPopup />
    </div>
  );
};

export default ConsoleDetail;
