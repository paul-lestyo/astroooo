import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortByStartDateDescending<T extends { startDate: string | null | undefined }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = parseDate(left.startDate)?.getTime() ?? 0;
    const rightTime = parseDate(right.startDate)?.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

export async function getPortfolioData() {
  const [about, technicalSkills, softSkills, contactInfo, workExperience, education, projects] = await Promise.all([
    reader.singletons.about.readOrThrow(),
    reader.singletons.technicalSkills.readOrThrow(),
    reader.singletons.softSkills.readOrThrow(),
    reader.singletons.contactInfo.readOrThrow(),
    reader.collections.workExperience.all(),
    reader.collections.education.all(),
    reader.collections.projects.all(),
  ]);

  return {
    about,
    technicalSkills,
    softSkills,
    contactInfo,
    workExperience: sortByStartDateDescending(workExperience.map(item => item.entry)).map((entry, index) => ({
      slug: workExperience[index]?.slug ?? entry.company,
      entry,
    })),
    education: sortByStartDateDescending(education.map(item => item.entry)).map((entry, index) => ({
      slug: education[index]?.slug ?? entry.campus,
      entry,
    })),
    projects,
  };
}

export type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>;