import { collection, config, fields, singleton } from '@keystatic/core';

const techStackOptions = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'React', value: 'react' },
  { label: 'Astro', value: 'astro' },
  { label: 'PHP', value: 'php' },
  { label: 'Laravel', value: 'laravel' },
  { label: 'CodeIgniter', value: 'codeigniter' },
  { label: 'Node.js', value: 'nodejs' },
  { label: 'Express.js', value: 'express' },
  { label: 'Golang', value: 'golang' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MongoDB', value: 'mongodb' },
  { label: 'SQL Server', value: 'sql-server' },
  { label: 'Git', value: 'git' },
  { label: 'Docker', value: 'docker' },
  { label: 'VS Code', value: 'vscode' },
  { label: 'Jira', value: 'jira' },
  { label: 'TensorFlow', value: 'tensorflow' },
  { label: 'OutSystems', value: 'outsystems' },
  { label: 'C#', value: 'csharp' },
] as const;

export default config({
  storage: {
    kind: 'github',
    repo: 'paul-lestyo/astroooo',
  },
  singletons: {
    about: singleton({
      label: 'About Me',
      path: 'src/content/about/',
      schema: {
        headline: fields.text({ label: 'Headline', multiline: true }),
        phone: fields.text({ label: 'Phone' }),
        email: fields.text({ label: 'Email' }),
        location: fields.text({ label: 'Location' }),
      },
    }),
    technicalSkills: singleton({
      label: 'Technical Skills',
      path: 'src/content/technical-skills/',
      schema: {
        frontend: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.url({ label: 'Image URL' }),
          }),
          { label: 'Frontend', itemLabel: props => props.fields.name.value }
        ),
        backend: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.url({ label: 'Image URL' }),
          }),
          { label: 'Backend', itemLabel: props => props.fields.name.value }
        ),
        database: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.url({ label: 'Image URL' }),
          }),
          { label: 'Database', itemLabel: props => props.fields.name.value }
        ),
        toolsAndOthers: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.url({ label: 'Image URL' }),
          }),
          { label: 'Tools & Others', itemLabel: props => props.fields.name.value }
        ),
      },
    }),
    softSkills: singleton({
      label: 'Soft Skills',
      path: 'src/content/soft-skills/',
      schema: {
        items: fields.array(fields.text({ label: 'Skill' }), {
          label: 'Soft Skills',
          itemLabel: props => props.value,
        }),
      },
    }),
    contactInfo: singleton({
      label: 'Contact Info',
      path: 'src/content/contact-info/',
      schema: {
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Phone' }),
        location: fields.text({ label: 'Location' }),
        linkedin: fields.url({ label: 'LinkedIn Link' }),
        github: fields.url({ label: 'GitHub Link' }),
      },
    }),
  },
  collections: {
    workExperience: collection({
      label: 'Work Experience',
      path: 'src/content/work-experience/*/',
      slugField: 'company',
      columns: ['company', 'position', 'startDate', 'endDate', 'stillWorking'],
      schema: {
        company: fields.slug({ name: { label: 'Company Name' } }),
        position: fields.text({ label: 'Position' }),
        startDate: fields.date({ label: 'Start Date' }),
        endDate: fields.date({ label: 'End Date' }),
        stillWorking: fields.checkbox({ label: 'Still Working', defaultValue: false }),
        jobType: fields.select({
          label: 'Jenis Pekerjaan',
          options: [
            { label: 'Permanent', value: 'permanent' },
            { label: 'Contract', value: 'contract' },
            { label: 'Freelance', value: 'freelance' },
            { label: 'Internship', value: 'internship' },
          ],
          defaultValue: 'contract',
        }),
        location: fields.text({ label: 'Lokasi' }),
        descriptionBullets: fields.array(fields.text({ label: 'Bullet Description' }), {
          label: 'Bullet Description',
          itemLabel: props => props.value,
        }),
      },
    }),
    education: collection({
      label: 'Education',
      path: 'src/content/education/*/',
      slugField: 'campus',
      columns: ['campus', 'degree', 'startDate', 'endDate'],
      schema: {
        campus: fields.slug({ name: { label: 'Campus' } }),
        degree: fields.text({ label: 'Degree' }),
        startDate: fields.date({ label: 'Start Date' }),
        endDate: fields.date({ label: 'End Date' }),
        descriptionBullets: fields.array(fields.text({ label: 'Bullet Description' }), {
          label: 'Bullet Description',
          itemLabel: props => props.value,
        }),
      },
    }),
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*/',
      slugField: 'name',
      columns: ['name', 'shortDescription'],
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        image: fields.url({ label: 'Image URL' }),
        shortDescription: fields.text({ label: 'Short Description' }),
        text: fields.text({ label: 'Text', multiline: true }),
        techstack: fields.multiselect({
          label: 'Tech Stack',
          options: techStackOptions.map(option => ({
            label: option.label,
            value: option.value,
          })),
          defaultValue: [],
        }),
      },
    }),
  },
});