import { notFound } from "next/navigation";
import { JasmineProjectPage } from "@/components/jasmine/JasmineProjectPage";
import { getJasmineProjectBySlug, jasmineProjects } from "@/data/jasmine";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return jasmineProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getJasmineProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: `${project.title} - Jasmine Gunarto`,
    description: `${project.title} by Jasmine Gunarto.`,
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getJasmineProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <JasmineProjectPage project={project} />;
}
