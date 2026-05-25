import { UrlForm } from '@/features/url/components/UrlForm';

export default function Home() {
  return (
    <main className="min-h-svh bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
        <UrlForm />
      </div>
    </main>
  );
}
