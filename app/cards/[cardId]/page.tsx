import Feature from "@/modules/CardDetails";

interface PageProps {
  params: Promise<{ cardId: string }>;
}

const page = async ({ params }: PageProps) => {
  const { cardId } = await params;
  return <Feature cardId={cardId} />;
};

export default page;
