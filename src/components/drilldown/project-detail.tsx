'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useAppSelector } from '@/redux/store';
import { useProjects } from '@/hooks/use-projects';
import { EmptyState } from './empty-state';
import { Calendar, Users, BarChart3, Loader2 } from 'lucide-react';

export function ProjectDetail() {
    const { selectedEmployee, selectedEmployeeName } =
        useAppSelector((s) => s.drilldown);

    const { data: allProjects = [], isLoading } = useProjects();

    // Filter projects where the selected employee is a collaborator
    const projects = allProjects.filter((project: any) => {
        if (!selectedEmployee) return true; // show all if no employee selected
        const employeeIds = (project.employees || []).map((e: any) => e.id);
        return employeeIds.includes(selectedEmployee);
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="text-muted-foreground font-medium">Loading projects...</span>
                </div>
            </div>
        );
    }

    if (projects.length === 0) {
        return <EmptyState title="No Projects Found" description={`No projects found for ${selectedEmployeeName || 'this selection'}.`} />;
    }

    return (
        <div className="space-y-6 fade-in">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    {selectedEmployeeName ? `${selectedEmployeeName} — Projects` : 'Project Details'}
                </h1>
                <p className="text-muted-foreground">{projects.length} project(s) found</p>
            </div>

            {/* Project Table */}
            <Card className="rounded-2xl border border-border/40 shadow-lg overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/30 bg-muted/30">
                                    <th className="text-left py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Project Name</th>
                                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">CTOs</th>
                                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">PMs</th>
                                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">TLs</th>
                                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employees</th>
                                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total</th>
                                    <th className="text-center py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projects.map((project: any) => {
                                    const ctoCount = project.ctos?.length || 0;
                                    const pmCount = project.pms?.length || 0;
                                    const tlCount = project.teamLeads?.length || 0;
                                    const empCount = project.employees?.length || 0;
                                    const total = ctoCount + pmCount + tlCount + empCount;

                                    return (
                                        <tr
                                            key={project.id}
                                            className="border-b border-border/20 hover:bg-primary/5 transition-colors duration-200"
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <BarChart3 className="h-4 w-4 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{project.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-500">
                                                    {ctoCount}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                                                    {pmCount}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-500">
                                                    {tlCount}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                                    {empCount}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Users className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-bold">{total}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {project.createdAt
                                                        ? new Date(project.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
                                                        : 'N/A'}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
