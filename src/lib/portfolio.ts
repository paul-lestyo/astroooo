import { createReader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';

const reader = createReader(process.cwd(), keystaticConfig);

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function sortByEntryStartDateDescending<T extends { entry: { startDate: string | null | undefined } }>(items: T[]) {
  return [...items].sort((left, right) => {
    const leftTime = parseDate(left.entry.startDate)?.getTime() ?? 0;
    const rightTime = parseDate(right.entry.startDate)?.getTime() ?? 0;
    return rightTime - leftTime;
  });
}

export async function getPortfolioData() {
  const [aboutRaw, technicalSkills, softSkills, contactInfo, workExperience, education, projectsRaw, blogRaw] = await Promise.all([
    reader.singletons.about.readOrThrow(),
    reader.singletons.technicalSkills.readOrThrow(),
    reader.singletons.softSkills.readOrThrow(),
    reader.singletons.contactInfo.readOrThrow(),
    reader.collections.workExperience.all(),
    reader.collections.education.all(),
    reader.collections.projects.all(),
    reader.collections.blog.all(),
  ]);

  const about = {
    ...aboutRaw,
    content: await aboutRaw.content(),
  };

  const workExperienceMapped = await Promise.all(workExperience.map(async item => {
    const isConditional = item.entry.stillWorking && typeof item.entry.stillWorking === 'object' && 'discriminant' in item.entry.stillWorking;
    const stillWorking = isConditional ? (item.entry.stillWorking as any).discriminant : !!item.entry.stillWorking;
    const endDate = isConditional 
      ? (stillWorking ? null : ((item.entry.stillWorking as any).value?.endDate ?? null))
      : ((item.entry as any).endDate ?? null);

    return {
      slug: item.slug,
      entry: {
        ...item.entry,
        stillWorking,
        endDate,
        content: await item.entry.content(),
      }
    };
  }));

  const educationMapped = await Promise.all(education.map(async item => {
    const isConditional = item.entry.stillStudying && typeof item.entry.stillStudying === 'object' && 'discriminant' in item.entry.stillStudying;
    const stillStudying = isConditional ? (item.entry.stillStudying as any).discriminant : false;
    const endDate = isConditional
      ? (stillStudying ? null : ((item.entry.stillStudying as any).value?.endDate ?? null))
      : ((item.entry as any).endDate ?? null);

    return {
      slug: item.slug,
      entry: {
        ...item.entry,
        stillStudying,
        endDate,
        content: await item.entry.content(),
      }
    };
  }));

  const projects = (await Promise.all(
    projectsRaw.map(async item => ({
      slug: item.slug,
      entry: {
        ...item.entry,
        content: await item.entry.content(),
      },
    }))
  )).filter(project => project.entry.status !== 'draft');

  const blogPosts = (await Promise.all(
    blogRaw.map(async item => ({
      slug: item.slug,
      entry: {
        ...item.entry,
        content: await item.entry.content(),
      },
    }))
  ))
    .filter(post => post.entry.status !== 'draft')
    .sort((a, b) => {
      const aTime = parseDate(a.entry.publishDate)?.getTime() ?? 0;
      const bTime = parseDate(b.entry.publishDate)?.getTime() ?? 0;
      return bTime - aTime;
    });

  return {
    about,
    technicalSkills,
    softSkills,
    contactInfo,
    workExperience: sortByEntryStartDateDescending(workExperienceMapped),
    education: sortByEntryStartDateDescending(educationMapped),
    projects,
    blogPosts,
  };
}

// Individual fetchers for detail pages
export async function getProjects() {
  const projectsRaw = await reader.collections.projects.all();
  const projects = await Promise.all(
    projectsRaw.map(async item => ({
      slug: item.slug,
      entry: {
        ...item.entry,
        content: await item.entry.content(),
      },
    }))
  );
  return projects.filter(p => p.entry.status !== 'draft');
}

export async function getProject(slug: string) {
  const entry = await reader.collections.projects.read(slug);
  if (!entry) return null;

  // Get work experience for relationship
  const workExperience = await reader.collections.workExperience.all();

  return {
    slug,
    entry: {
      ...entry,
      content: await entry.content(),
    },
    workExperience: workExperience.map(item => ({
      slug: item.slug,
      entry: { company: item.entry.company },
    })),
  };
}

export async function getBlogPosts() {
  const blogRaw = await reader.collections.blog.all();
  const posts = await Promise.all(
    blogRaw.map(async item => ({
      slug: item.slug,
      entry: {
        ...item.entry,
        content: await item.entry.content(),
      },
    }))
  );
  return posts
    .filter(p => p.entry.status !== 'draft')
    .sort((a, b) => {
      const aTime = parseDate(a.entry.publishDate)?.getTime() ?? 0;
      const bTime = parseDate(b.entry.publishDate)?.getTime() ?? 0;
      return bTime - aTime;
    });
}

export async function getBlogPost(slug: string) {
  const entry = await reader.collections.blog.read(slug);
  if (!entry) return null;
  return {
    slug,
    entry: {
      ...entry,
      content: await entry.content(),
    },
  };
}

export type PortfolioData = Awaited<ReturnType<typeof getPortfolioData>>;