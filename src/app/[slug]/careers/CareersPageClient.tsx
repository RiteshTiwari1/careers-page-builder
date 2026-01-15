'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { Company, PageSection, Job, JobFilters } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  Briefcase,
  Clock,
  Search,
  Building2,
  Heart,
  Globe,
  GraduationCap,
  Plane,
  DollarSign,
  Users,
  Baby,
  TrendingUp,
  X,
} from 'lucide-react';

interface Props {
  company: Company;
  sections: PageSection[];
  jobs: Job[];
}

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="w-6 h-6" />,
  globe: <Globe className="w-6 h-6" />,
  'graduation-cap': <GraduationCap className="w-6 h-6" />,
  plane: <Plane className="w-6 h-6" />,
  'dollar-sign': <DollarSign className="w-6 h-6" />,
  users: <Users className="w-6 h-6" />,
  baby: <Baby className="w-6 h-6" />,
  'trending-up': <TrendingUp className="w-6 h-6" />,
};

export default function CareersPageClient({ company, sections, jobs }: Props) {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    location: '',
    department: '',
    employment_type: '',
    work_policy: '',
  });

  const theme = company.theme;

  // Extract unique filter options from jobs (filter out empty values)
  const filterOptions = useMemo(() => {
    return {
      locations: [...new Set(jobs.map((j) => j.location).filter(Boolean))].sort(),
      departments: [...new Set(jobs.map((j) => j.department).filter(Boolean))].sort(),
      employmentTypes: [...new Set(jobs.map((j) => j.employment_type).filter(Boolean))].sort(),
      workPolicies: [...new Set(jobs.map((j) => j.work_policy).filter(Boolean))].sort(),
    };
  }, [jobs]);

  // Filter jobs based on current filters
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !filters.search ||
        job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        job.department.toLowerCase().includes(filters.search.toLowerCase());
      const matchesLocation = !filters.location || filters.location === 'all' || job.location === filters.location;
      const matchesDepartment = !filters.department || filters.department === 'all' || job.department === filters.department;
      const matchesEmploymentType =
        !filters.employment_type || filters.employment_type === 'all' || job.employment_type === filters.employment_type;
      const matchesWorkPolicy = !filters.work_policy || filters.work_policy === 'all' || job.work_policy === filters.work_policy;

      return (
        matchesSearch &&
        matchesLocation &&
        matchesDepartment &&
        matchesEmploymentType &&
        matchesWorkPolicy
      );
    });
  }, [jobs, filters]);

  const activeFiltersCount = Object.values(filters).filter((v) => v !== '' && v !== 'all').length;

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      department: '',
      employment_type: '',
      work_policy: '',
    });
  };

  const formatPostedDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Posted today';
    if (diffDays === 1) return 'Posted yesterday';
    if (diffDays < 7) return `Posted ${diffDays} days ago`;
    if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} weeks ago`;
    return `Posted ${Math.floor(diffDays / 30)} months ago`;
  };

  const renderSection = (section: PageSection) => {
    switch (section.type) {
      case 'hero':
        return (
          <section
            key={section.id}
            className="relative h-[400px] flex items-center justify-center text-white"
            style={{ backgroundColor: theme.primaryColor }}
          >
            {company.banner_url && (
              <Image
                src={company.banner_url}
                alt={company.name}
                fill
                className="object-cover opacity-30"
                priority
              />
            )}
            <div className="relative z-10 text-center px-4">
              {company.logo_url && (
                <Image
                  src={company.logo_url}
                  alt={company.name}
                  width={80}
                  height={80}
                  className="mx-auto mb-6 rounded-xl"
                />
              )}
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{section.title}</h1>
              {section.content.tagline && (
                <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
                  {section.content.tagline}
                </p>
              )}
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={section.id} className="py-16 px-4" style={{ backgroundColor: theme.backgroundColor }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center" style={{ color: theme.textColor }}>
                {section.title}
              </h2>
              <p className="text-lg leading-relaxed text-center" style={{ color: theme.textColor }}>
                {section.content.text}
              </p>
            </div>
          </section>
        );

      case 'benefits':
        return (
          <section key={section.id} className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: theme.textColor }}>
                {section.title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.content.items?.map((item) => (
                  <Card key={item.id} className="text-center">
                    <CardContent className="pt-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
                      >
                        {iconMap[item.icon] || <Heart className="w-6 h-6" />}
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        );

      case 'culture_video':
        return (
          <section key={section.id} className="py-16 px-4" style={{ backgroundColor: theme.backgroundColor }}>
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.textColor }}>
                {section.title}
              </h2>
              {section.content.videoUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src={section.content.videoUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </section>
        );

      case 'open_jobs':
        return (
          <section key={section.id} className="py-16 px-4" id="jobs" style={{ backgroundColor: theme.backgroundColor }}>
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.textColor }}>
                {section.title}
              </h2>

              {/* Filters */}
              <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters({ ...filters, location: value })}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {filterOptions.locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.department}
                    onValueChange={(value) => setFilters({ ...filters, department: value })}
                  >
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {filterOptions.departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={filters.work_policy}
                    onValueChange={(value) => setFilters({ ...filters, work_policy: value })}
                  >
                    <SelectTrigger className="w-full md:w-[150px]">
                      <SelectValue placeholder="Work Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {filterOptions.workPolicies.map((policy) => (
                        <SelectItem key={policy} value={policy}>
                          {policy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {activeFiltersCount > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      {filteredJobs.length} of {jobs.length} jobs
                    </span>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8">
                      <X className="w-3 h-3 mr-1" />
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>

              {/* Job Listings */}
              <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No jobs match your filters</p>
                    <Button variant="link" onClick={clearFilters}>
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  filteredJobs.map((job) => (
                    <Card
                      key={job.id}
                      className="hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {job.department}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {formatPostedDate(job.posted_at)}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">{job.work_policy}</Badge>
                            <Badge variant="outline">{job.employment_type}</Badge>
                            <Badge
                              style={{
                                backgroundColor: `${theme.primaryColor}20`,
                                color: theme.primaryColor,
                              }}
                            >
                              {job.experience_level}
                            </Badge>
                          </div>
                        </div>
                        {job.salary_range && (
                          <p className="mt-3 text-sm font-medium text-gray-700">
                            {job.salary_range}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.backgroundColor }}>
      {/* Render all sections */}
      {sections.map(renderSection)}

      {/* Footer */}
      <footer className="py-8 px-4 border-t" style={{ backgroundColor: theme.backgroundColor }}>
        <div className="max-w-6xl mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
          <p className="mt-2">
            Powered by <span className="font-medium">Careers Page Builder</span>
          </p>
        </div>
      </footer>
    </div>
  );
}
