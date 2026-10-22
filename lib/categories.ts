const LABELS: Record<string, string> = {
  nouns: "sustantivo",
  verbs: "verbo",
  adjectives: "adjetivo",
  food: "comida",
  travel: "viaje",
  home: "casa",
  body: "cuerpo",
  nature: "naturaleza",
  work: "trabajo",
  leisure: "ocio",
  clothing: "ropa",
  animals: "animales",
  emotions: "emociones",
  society: "sociedad",
  technology: "tecnología",
  abstract: "abstracto",
  movie: "película",
  book: "libro",
  person: "persona",
};

export const categoryLabel = (category: string) => LABELS[category] ?? category;
