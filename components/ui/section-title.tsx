type SectionTitleProps = {
  title: string;
  description?: string;
};

export default function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <header className="mb-5 space-y-1">
      <h1 className="text-2xl font-semibold text-zinc-900 md:text-3xl">{title}</h1>
      {description ? <p className="text-base text-zinc-600">{description}</p> : null}
    </header>
  );
}
