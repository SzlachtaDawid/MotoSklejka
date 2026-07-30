import Link from "next/link";
import FeatureCard from "./_components/FeatureCard";

export default function HomePage() {
  return (
    <div className="space-y-12 py-10">
      <section className="hero bg-base-200 rounded-box">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold md:text-5xl">Znajdź towarzyszy podróży na dwóch kołach</h1>
            <p className="py-6">
              MotoSklejka pomaga motocyklistom planować wspólne wyjazdy — zaznacz start trasy na mapie, dobierz ekipę o
              podobnym stylu jazdy i poziomie doświadczenia, i ruszajcie razem.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/sign-up" className="btn btn-primary">
                Załóż konto
              </Link>
              <Link href="/map" className="btn btn-outline">
                Zobacz mapę
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <FeatureCard
          title="Mapa tras"
          description="Zaznacz miejsce startu, dodaj planowaną trasę, typ motocykla i poziom doświadczenia. Inni motocykliści w okolicy zobaczą Twój wyjazd i będą mogli się przyłączyć."
          actionLabel="Otwórz mapę"
          actionHref="/map"
        />
        <FeatureCard
          title="Zespoły"
          description="Twórz własne grupy jazdy lub przyłącz się do istniejących. Zespoły mogą być prywatne (tylko dla zaproszonych) albo otwarte i dawać aktywnym członkom dodatkowe benefity."
          actionLabel="Zobacz zespoły"
          actionHref="/teams"
        />
        <FeatureCard
          title="Konto"
          description="Zaloguj się i zarządzaj profilem: motocyklem, poziomem doświadczenia, historią wyjazdów i zespołami, do których należysz."
          actionLabel="Zaloguj"
          actionHref="/login"
        />
      </section>
    </div>
  );
}
