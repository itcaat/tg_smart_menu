import SectionPageClient from './SectionPageClient';
import { getSections } from '@/lib/data';

// Генерация статических путей для всех разделов
export async function generateStaticParams() {
  const sections = getSections();
  return sections.map((section) => ({
    id: section.id,
  }));
}

export default function SectionPage({ params }: { params: { id: string } }) {
  return <SectionPageClient sectionId={params.id} />;
}
