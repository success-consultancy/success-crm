import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description:
    'Schedule a consultation with Success Education & Visa Services. Choose from Education, Visa, Skill Assessment, Health Insurance, or Tribunal services at our branches in Canberra, Sydney, Brisbane, Gold Coast, Launceston, and Kathmandu.',
  keywords: [
    'book appointment',
    'education consultant',
    'visa services',
    'skill assessment',
    'health insurance',
    'tribunal service',
    'Success Education',
    'Canberra',
    'Sydney',
    'Brisbane',
    'Gold Coast',
    'Launceston',
    'Kathmandu',
  ],
  openGraph: {
    title: 'Book an Appointment | Success Education & Visa Services',
    description:
      'Schedule a consultation with Success Education & Visa Services. Choose from Education, Visa, Skill Assessment, Health Insurance, or Tribunal services across Australia and Nepal.',
    type: 'website',
    ...(siteUrl && { url: `${siteUrl}/appointments` }),
  },
  twitter: {
    card: 'summary',
    title: 'Book an Appointment | Success Education & Visa Services',
    description:
      'Schedule a consultation with Success Education & Visa Services across Australia and Nepal.',
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(siteUrl && {
    alternates: {
      canonical: `${siteUrl}/appointments`,
    },
  }),
};

export default function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
