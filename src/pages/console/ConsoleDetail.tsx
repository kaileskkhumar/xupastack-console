import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useApp, useDeleteApp } from "@/hooks/use-apps";
import DetailHeader from "@/components/console/detail/DetailHeader";
import SetupChecklist from "@/components/console/detail/SetupChecklist";
import GatewayUrlCard from "@/components/console/detail/GatewayUrlCard";
import GoLiveChecklist from "@/components/console/detail/GoLiveChecklist";
import IntegrationSnippets from "@/components/console/detail/IntegrationSnippets";
import DiagnosticsCard from "@/components/console/detail/DiagnosticsCard";
import SelfHostTab from "@/components/console/detail/SelfHostTab";
import DonationPopup from "@/components/console/DonationPopup";
import CapacityModal from "@/components/console/CapacityModal";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ConsoleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: gw, isLoading, isError } = useApp(id);
  const deleteApp = useDeleteApp();
  const [activeTab, setActiveTab] = useState("overview");

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="self-host">Self-Host</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            {gw.gatewayUrl && <SetupChecklist appId={gw.id} gatewayUrl={gw.gatewayUrl} />}
            {gw.gatewayUrl && <GatewayUrlCard url={gw.gatewayUrl} />}
            <IntegrationSnippets appId={gw.id} />
            <DiagnosticsCard appId={gw.id} />
            <GoLiveChecklist gw={gw} onDelete={handleDelete} isDeleting={deleteApp.isPending} />
          </TabsContent>

          <TabsContent value="self-host">
            <SelfHostTab appId={gw.id} />
          </TabsContent>
        </Tabs>
      </motion.div>

      <CapacityModal onSelfHost={() => setActiveTab("self-host")} />
      <DonationPopup />
    </div>
  );
};

export default ConsoleDetail;
