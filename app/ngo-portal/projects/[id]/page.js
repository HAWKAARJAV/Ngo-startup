import ProjectWorkbench from "./workbench";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ProjectWorkbenchPage(props) {
    const params = await props.params;
    const { id } = params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: { tranches: true }
    });

    if (!project) notFound();

    return <ProjectWorkbench project={JSON.parse(JSON.stringify(project))} />;
}
