const features = [
  {
    icon: "🔒",
    title: "Prywatne i otwarte grupy",
    desc: "Twórz zamknięte ekipy tylko dla znajomych albo otwarte grupy, do których każdy motocyklista może się przyłączyć.",
  },
  {
    icon: "📅",
    title: "Wspólne planowanie wyjazdów",
    desc: "Jeden widok dla całego zespołu — kto jedzie, skąd startuje i jaką trasę planuje. Koniec z chaosem na grupach FB.",
  },
  {
    icon: "🏆",
    title: "Rankingi i aktywność",
    desc: "Aktywni członkowie zdobywają odznaki i awansują w rankingu zespołu. Im więcej wyjazdów, tym wyżej.",
  },
  {
    icon: "💬",
    title: "Czat ekipy",
    desc: "Gadajcie o trasach, pogodzie i sprzęcie bez wychodzenia z aplikacji.",
  },
];

const Teams = () => {
  return (
    <div className="flex flex-col items-center gap-10 py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="badge badge-warning badge-lg font-semibold tracking-wide uppercase">Wkrótce</div>
        <h1 className="text-4xl font-bold md:text-5xl">Zespoły są w budowie</h1>
        <p className="text-base-content/70 max-w-xl text-lg">
          Ta sekcja jeszcze nie wstała z łóżka — ale pracuję nad nią. Zespoły to jeden z głównych filarów MotoSklejki i
          chcę zrobić to porządnie.
        </p>
      </div>

      <div className="grid w-full max-w-2xl gap-4 text-left sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card bg-base-200 border-base-300 border">
            <div className="card-body gap-2 p-5">
              <div className="text-3xl">{f.icon}</div>
              <h2 className="card-title text-base">{f.title}</h2>
              <p className="text-base-content/60 text-sm">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div role="alert" className="alert alert-info max-w-xl">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        <span>
          Masz pomysł na funkcję dla zespołów? Napisz do mnie na FB lub IG — projektuję tę część na bieżąco i chętnie
          posłucham.
        </span>
      </div>
    </div>
  );
};

export default Teams;
