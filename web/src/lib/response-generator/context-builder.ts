import type { FusedResults, TUArticle, Interpello } from "../types";

const MAX_ARTICLE_CHARS = 4000;
const MAX_INTERPELLO_CHARS = 3000;

export function buildContext(results: FusedResults): string {
  const sections: string[] = [];

  if (results.articles.length > 0) {
    sections.push("=== ARTICOLI DEL TESTO UNICO IVA (D.Lgs. 10/2026) ===\n");
    for (const result of results.articles) {
      if (!result.article) continue;
      sections.push(formatArticle(result.article));
    }
  }

  if (results.interpelli.length > 0) {
    sections.push(
      "\n=== INTERPELLI DELL'AGENZIA DELLE ENTRATE ===\n"
    );
    for (const result of results.interpelli) {
      if (!result.interpello) continue;
      sections.push(formatInterpello(result.interpello));
    }
  }

  return sections.join("\n");
}

function formatArticle(art: TUArticle): string {
  const header = [
    `--- ${art.metadati_rag.citazione_formale} ---`,
    `Titolo: ${art.titolo}`,
    `Struttura: Titolo ${art.struttura.titolo.numero} (${art.struttura.titolo.nome}) > Capo ${art.struttura.capo.numero} (${art.struttura.capo.nome})`,
    `Temi: ${art.temi.join(", ")}`,
  ];

  const vecchio = art.riferimenti_vecchio_codice.riferimenti_strutturati;
  if (vecchio.length > 0) {
    header.push(
      `Vecchio codice: ${vecchio.map((v) => `${v.norma} art. ${v.articolo}`).join(", ")}`
    );
  }

  if (art.riferimenti_interni.length > 0) {
    header.push(
      `Riferimenti interni TU IVA: artt. ${art.riferimenti_interni.join(", ")}`
    );
  }

  let testo = art.testo_integrale;
  if (testo.length > MAX_ARTICLE_CHARS) {
    testo =
      testo.substring(0, MAX_ARTICLE_CHARS) + "\n[...testo troncato...]";
  }

  header.push(`\nTesto:\n${testo}`);
  return header.join("\n") + "\n";
}

function formatInterpello(ip: Interpello): string {
  const header = [
    `--- Interpello n. ${ip.numero}/${ip.anno} (${ip.data}) ---`,
    `Tag: ${ip.tag}`,
    `Oggetto: ${ip.oggetto}`,
    `Massima: ${ip.massima}`,
    `Temi: ${ip.temi.join(", ")}`,
  ];

  if (ip.link_pdf) {
    header.push(`PDF: ${ip.link_pdf}`);
  }

  const parere = ip.sezioni?.parere_ade || "";
  if (parere) {
    let parereText = parere;
    if (parereText.length > MAX_INTERPELLO_CHARS) {
      parereText =
        parereText.substring(0, MAX_INTERPELLO_CHARS) +
        "\n[...parere troncato...]";
    }
    header.push(`\nParere AdE:\n${parereText}`);
  }

  return header.join("\n") + "\n";
}
