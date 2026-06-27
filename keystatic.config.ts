import { collection, config, fields, singleton, component } from '@keystatic/core';
import React from 'react';



export default config({
  storage: process.env.NODE_ENV === 'production'
    ? { kind: 'github', repo: 'paul-lestyo/astroooo' }
    : { kind: 'local' },
  singletons: {
    about: singleton({
      label: 'About Me',
      path: 'src/content/about/',
      format: { data: 'yaml', contentField: 'content' },
      entryLayout: 'content',
      schema: {
        phone: fields.text({ label: 'Phone' }),
        email: fields.text({ label: 'Email' }),
        location: fields.text({ label: 'Location' }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
    technicalSkills: singleton({
      label: 'Technical Skills',
      path: 'src/content/technical-skills/',
      schema: {
        frontend: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/skills',
              publicPath: '/images/skills/',
              validation: { accept: 'image/*, .svg' },
            }),
          }),
          { label: 'Frontend', itemLabel: props => props.fields.name.value }
        ),
        backend: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/skills',
              publicPath: '/images/skills/',
              validation: { accept: 'image/*, .svg' },
            }),
          }),
          { label: 'Backend', itemLabel: props => props.fields.name.value }
        ),
        database: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/skills',
              publicPath: '/images/skills/',
              validation: { accept: 'image/*, .svg' },
            }),
          }),
          { label: 'Database', itemLabel: props => props.fields.name.value }
        ),
        toolsAndOthers: fields.array(
          fields.object({
            name: fields.text({ label: 'Name' }),
            image: fields.image({
              label: 'Image',
              directory: 'public/images/skills',
              publicPath: '/images/skills/',
              validation: { accept: 'image/*, .svg' },
            }),
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
      columns: ['company', 'position', 'startDate'],
      format: { data: 'yaml', contentField: 'content' },
      entryLayout: 'content',
      schema: {
        company: fields.slug({ name: { label: 'Company Name' } }),
        position: fields.text({ label: 'Position' }),
        startDate: fields.date({ label: 'Start Date' }),
        stillWorking: fields.conditional(
          fields.checkbox({ label: 'Masih Bekerja Di Sini?', defaultValue: false }),
          {
            true: fields.empty(),
            false: fields.object({
              endDate: fields.date({ label: 'Tanggal Selesai' }),
            }),
          }
        ),
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
        content: fields.document({
          label: 'Deskripsi',
          formatting: { listTypes: { ordered: true, unordered: true }, inlineMarks: true },
        }),
      },
    }),
    education: collection({
      label: 'Education',
      path: 'src/content/education/*/',
      slugField: 'campus',
      columns: ['campus', 'degree', 'startDate'],
      format: { data: 'yaml', contentField: 'content' },
      entryLayout: 'content',
      schema: {
        campus: fields.slug({ name: { label: 'Campus' } }),
        degree: fields.text({ label: 'Degree' }),
        startDate: fields.date({ label: 'Start Date' }),
        stillStudying: fields.conditional(
          fields.checkbox({ label: 'Masih Belajar Di Sini?', defaultValue: false }),
          {
            true: fields.empty(),
            false: fields.object({
              endDate: fields.date({ label: 'Tanggal Selesai' }),
            }),
          }
        ),
        content: fields.document({
          label: 'Deskripsi',
          formatting: { listTypes: { ordered: true, unordered: true }, inlineMarks: true },
        }),
      },
    }),
    projects: collection({
      label: 'Projects',
      path: 'src/content/projects/*/',
      slugField: 'name',
      columns: ['name', 'shortDescription'],
      format: { data: 'yaml', contentField: 'content' },
      entryLayout: 'content',
      schema: {
        name: fields.slug({ name: { label: 'Name' } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
          ],
          defaultValue: 'published',
        }),
        image: fields.image({
          label: 'Upload Screenshot Proyek',
          directory: 'public/images/projects',
          publicPath: '/images/projects/',
        }),
        experience: fields.relationship({
          label: 'Dibuat saat bekerja di:',
          collection: 'workExperience',
          validation: { isRequired: false },
        }),
        shortDescription: fields.text({ label: 'Short Description' }),
        techstack: fields.array(fields.text({ label: 'Tech' }), {
          label: 'Tech Stack',
          itemLabel: props => props.value,
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          links: true,
          dividers: true,
          componentBlocks: {
            alert: component({
              label: 'Alert',
              schema: {
                intent: fields.select({
                  label: 'Intent',
                  options: [
                    { label: 'Info', value: 'info' },
                    { label: 'Warning', value: 'warning' },
                  ],
                  defaultValue: 'info',
                }),
                content: fields.child({ kind: 'block', placeholder: 'Alert text...' }),
              },
              preview: (props: any) => {
                return React.createElement(
                  'div',
                  {
                    style: {
                      padding: '12px',
                      margin: '12px 0',
                      border: '1px solid',
                      borderRadius: '4px',
                      borderColor: props.fields.intent.value === 'warning' ? '#fcd34d' : '#93c5fd',
                      backgroundColor: props.fields.intent.value === 'warning' ? '#fef3c7' : '#eff6ff',
                      color: props.fields.intent.value === 'warning' ? '#92400e' : '#1e40af',
                    }
                  },
                  React.createElement('strong', null, props.fields.intent.value.toUpperCase()),
                  ': ',
                  props.fields.content.element
                );
              }
            })
          }
        }),
      },
    }),
    blog: collection({
      label: 'Blog',
      path: 'src/content/blog/*/',
      slugField: 'title',
      columns: ['title', 'status', 'publishDate'],
      format: { data: 'yaml', contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Draft', value: 'draft' },
          ],
          defaultValue: 'draft',
        }),
        publishDate: fields.date({ label: 'Publish Date' }),
        coverImage: fields.image({
          label: 'Cover Image',
          directory: 'public/images/blog',
          publicPath: '/images/blog/',
        }),
        excerpt: fields.text({ label: 'Excerpt', multiline: true }),
        tags: fields.array(fields.text({ label: 'Tag' }), {
          label: 'Tags',
          itemLabel: props => props.value,
        }),
        content: fields.document({
          label: 'Content',
          formatting: true,
          links: true,
          dividers: true,
        }),
      },
    }),
  },
});